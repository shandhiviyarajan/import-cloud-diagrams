import requests
import json
import time
from bs4 import BeautifulSoup

p_map = {}

for i in range(1, 135):
    result = requests.get("https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?&page=" + str(i))
    soup = BeautifulSoup(result.text, 'html.parser')

    table = soup.find(id='table-service-names-port-numbers')
    trs = table.find_all('tr')

    last_known = ""

    for tr in trs:
        tds = tr.find_all('td')
        if len(tds) >= 2 and (tds[0].text != "") and tds[1].text != "":
            # if tds[0].text != "":
            last_known = tds[0].text
            
            key = tds[1].text
            if "-" in key:
                between = key.split("-")
                for k in range(int(between[0]), (int(between[1]) + 1)):
                    p_map[k] = last_known
            else:
                p_map[key] = last_known

    
    print(i)
    time.sleep(0.05)

with open('result.json', 'w') as fp:
    json.dump(p_map, fp)