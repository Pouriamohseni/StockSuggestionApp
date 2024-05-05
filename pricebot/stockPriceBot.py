import psycopg2
import os
import dotenv
import sched
import time
import logging
import yfinance as yf
from datetime import datetime, timedelta
import warnings
from requestCache import session

dotenv.load_dotenv()

# Suppress all future warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
try:
    conn = psycopg2.connect(
        host=os.getenv("DATABASE_HOST"),
        database=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD"),
        port=os.getenv("DATABASE_PORT")
    )

    cur = conn.cursor()

    logging.info('PostgreSQL database version:')
    cur.execute('SELECT version()')

    # display the PostgreSQL database server version
    db_version = cur.fetchone()
    logging.info(db_version)
    logging.info("CONNECTION TO DB ESTABLISHED")
    cur.close()
except (Exception, psycopg2.DatabaseError) as error:
    logging.error(error)
    if conn is not None:
        conn.close()
        logging.info('Database connection closed.')
    
    exit()

def bot(scheduler):
    scheduler.enter(60, 1, bot, (scheduler,))
    try:
        logging.info("NEXT UPDATE ITERATION")
        # Open connection
        cur = conn.cursor()
        
        # Main api fetching and update logic here
        cur.execute("SELECT ticker FROM stocks_stock")
        ticker_list = cur.fetchall()
        ticker_list = [ticker[0] for ticker in ticker_list]
        ticker_list_str = " ".join(ticker_list)

        # yf_stock = yf.Tickers(ticker_list_str, session=session)
        yf_stock = yf.Tickers(ticker_list_str)
        yf_stock = yf_stock.tickers
        current_year = datetime.now().year

        print(yf_stock['AAPL'].fast_info)

        current_date = datetime.now()
        last_week_date = current_date - timedelta(days=current_date.weekday() + 7)
        last_week_formatted = last_week_date.strftime("%Y-%m-%d")

        data = []
        for stock in yf_stock:
            ticker = stock
            current_price = round(yf_stock[stock].fast_info["lastPrice"], 2)
            try:
                five_year_open = (
                    yf_stock[stock].history(start=f"{current_year - 5}-01-02", end=f"{current_year - 5}-01-03", interval="1d")
                )
                five_year_open = five_year_open["Open"].iloc[0]
                five_year_percent = round(((current_price - five_year_open) / five_year_open) * 100, 2)

                last_week_open = (
                    yf_stock[stock].history(start=last_week_formatted, interval="5d")
                )
                last_week_open = last_week_open["Open"].iloc[0]
                one_week_percent = round(((current_price - last_week_open) / last_week_open) * 100, 2) 

                data.append((current_price, one_week_percent, five_year_percent, ticker))
                # data.append((current_price, ticker))
            except Exception:
                pass

        # Execute the batch update
        update_query = """
            UPDATE stocks_stock
            SET price = %s, week_growth = %s, five_year_growth = %s
            WHERE ticker = %s
        """
        cur.executemany(update_query, data)
        
        conn.commit()

        logging.info("Done updating stocks")
        
        # Close connection
        cur.close()
    except(Exception, psycopg2.DatabaseError) as error:
        logging.error("STOCK PRICE UPDATE FAILURE")
        logging.error(error)
        if conn is not None:
            conn.close()
            logging.info('Database connection closed.')
        
        exit()

my_scheduler = sched.scheduler(time.time, time.sleep)
my_scheduler.enter(1, 1, bot, (my_scheduler,))
my_scheduler.run()