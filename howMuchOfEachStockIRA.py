import requests
from bs4 import BeautifulSoup

def getPrice(urlEnding):    
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'}
    url = f'https://www.google.com/finance/quote/{urlEnding}'
    r = requests.get(url)
    soup = BeautifulSoup(r.text, 'html.parser')
    price = float(soup.find("div", {"class": "YMlKec fxKbKc"}).text.strip('$'))
    return price

VOOStockPrice = getPrice('VOO:NYSEARCA?hl=en')
VOStockPrice = getPrice('VO:NYSEARCA?hl=en')
SPSMStockPrice = getPrice('SPSM:NYSEARCA?hl=en')
STIPStockPrice = getPrice('STIP:NYSEARCA?hl=en')
VPLStockPrice = getPrice('VPL:NYSEARCA?hl=en')
JEPQStockPrice = getPrice('JEPQ:NASDAQ?hl=en')


moneyForUse = float(input("How much money do you have available: "))
inputtedVOOStockCount = float(input("How many VOO stocks do you have: "))
inputtedVOStockCount = float(input("How many VO stocks do you have: "))
inputtedSPSMStockCount = float(input("How many SPSM stocks do you have: "))
inputtedSTIPStockCount = float(input("How many STIP stocks do you have: "))
inputtedVPLStockCount = float(input("How many VPL stocks do you have: "))
inputtedJEPQStockCount = float(input("How many JEPQ stocks do you have: "))
totalStockCount = inputtedVOOStockCount + inputtedVOStockCount + inputtedSPSMStockCount + inputtedSTIPStockCount + inputtedVPLStockCount + inputtedJEPQStockCount

newStocksToBuyVOO = 0
newStocksToBuyVO = 0
newStocksToBuySPSM = 0
newStocksToBuySTIP = 0
newStocksToBuyVPL = 0
newStocksToBuyJEPQ = 0

while (moneyForUse > 50):
    if ((inputtedVOOStockCount + newStocksToBuyVOO)/totalStockCount < .35 and moneyForUse > VOOStockPrice):
        moneyForUse = moneyForUse - VOOStockPrice
        newStocksToBuyVOO += 1
        totalStockCount += 1
    elif((inputtedVOStockCount + newStocksToBuyVO)/totalStockCount < .20 and moneyForUse > VOStockPrice):
        moneyForUse = moneyForUse - VOStockPrice
        newStocksToBuyVO += 1
        totalStockCount += 1
    elif((inputtedSPSMStockCount + newStocksToBuySPSM)/totalStockCount < .10 and moneyForUse > SPSMStockPrice):
        moneyForUse = moneyForUse - SPSMStockPrice
        newStocksToBuySPSM += 1
        totalStockCount += 1
    elif((inputtedSTIPStockCount + newStocksToBuySTIP)/totalStockCount < .20 and moneyForUse > STIPStockPrice):
        moneyForUse = moneyForUse - STIPStockPrice
        newStocksToBuySTIP += 1
        totalStockCount += 1
    elif((inputtedVPLStockCount + newStocksToBuyVPL)/totalStockCount < .10 and moneyForUse > VPLStockPrice):
        moneyForUse = moneyForUse - VPLStockPrice
        newStocksToBuyVPL += 1
        totalStockCount += 1
    elif((inputtedJEPQStockCount + newStocksToBuyJEPQ)/totalStockCount < .05 and moneyForUse > JEPQStockPrice):
        moneyForUse = moneyForUse - JEPQStockPrice
        newStocksToBuyJEPQ += 1
        totalStockCount += 1
    else:
        break

print('VOO: ', newStocksToBuyVOO)
print('VO: ', newStocksToBuyVO)
print('SPSM: ', newStocksToBuySPSM)
print('STIP: ', newStocksToBuySTIP)
print('VPL: ', newStocksToBuyVPL)
print('JEPQ: ', newStocksToBuyJEPQ)
print(moneyForUse)