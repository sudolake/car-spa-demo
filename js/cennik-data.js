/*
  CENNÍK – jediné miesto, kde sa menia ceny.

  • Ceny sa zapisujú BEZ DPH (net), presne ako v pôvodnom cenníku.
    Cena s DPH sa dopočíta: net × 1,23, zaokrúhlené na celé eurá.
    Ak chcete okrúhlu sumu s DPH, pridajte k položke napr.  vat: 1100
  • Bunky s „x" sa nezapisujú – položka sa jednoducho vynechá.
  • from: true  → pred cenu sa dá „od"
    plus: true  → pred cenu sa dá „+" (doplnkové služby)

  Rozloženie sekcie:
    "tiles" – dlaždice (napr. jedna služba v rôznych rozsahoch)
    "list"  – riadky s názvom a cenou vpravo
    "band"  – jedna cena na žltom páse (prvá položka v items)
*/
window.CENNIK = [
  {
    id: "ppf",
    title: "PPF fólie",
    desc: "Priehľadná ochranná fólia na lak. Cena závisí od typu fólie a od toho, koľko auta chcete prelepiť.",
    sections: [
      {
        title: "Lesklá PPF, záruka 7 rokov",
        layout: "tiles",
        items: [
          { label: "Predná časť", net: 900, from: true },
          { label: "Predná časť + predné blatníky", net: 1200, from: true },
          { label: "Celé vozidlo", net: 3300, from: true }
        ]
      },
      {
        title: "Lesklá PPF, záruka 12 rokov",
        layout: "tiles",
        items: [
          { label: "Predná časť", net: 1100, from: true },
          { label: "Predná časť + predné blatníky", net: 1400, from: true },
          { label: "Celé vozidlo", net: 3600, from: true }
        ]
      },
      {
        title: "Matná PPF",
        desc: "Lesklý lak zmení na matný a zároveň ho chráni.",
        layout: "tiles",
        items: [
          { label: "Predná časť", net: 1150, from: true },
          { label: "Predná časť + predné blatníky", net: 1450, from: true },
          { label: "Celé vozidlo", net: 3700, from: true }
        ]
      },
      {
        title: "Farebná PPF a čelné sklo",
        layout: "list",
        items: [
          { label: "Farebná PPF", sub: "celé vozidlo, zmena farby s ochranou laku", net: 4000, from: true },
          { label: "PPF na čelné sklo", sub: "chráni sklo pred kamienkami", net: 350 }
        ]
      },
      {
        title: "Keramická ochrana na zvyšok vozidla",
        layout: "list",
        items: [
          { label: "Keramika na diely bez fólie", sub: "k PPF na prednú časť alebo prednú časť s blatníkmi", net: 500, from: true }
        ],
        note: "Diely, na ktorých nie je fólia, ochránime keramikou. Pri PPF na celé vozidlo sa nerobí."
      }
    ]
  },
  {
    id: "keramika",
    title: "Keramika a leštenie",
    desc: "Leštenie odstráni hologramy a jemné škrabance, keramika výsledok ochráni. Čím dlhšia ochrana, tým viac vrstiev.",
    sections: [
      {
        title: "Keramický sealant bez leštenia",
        desc: "Pre auto s lakom v dobrom stave. Rýchla ochrana a lesk bez korekcie laku.",
        layout: "band",
        items: [{ net: 200 }]
      },
      {
        title: "S 1-krokovým leštením",
        desc: "Odstráni väčšinu hologramov a jemných škrabancov.",
        layout: "tiles",
        cols: 4,
        items: [
          { label: "Keramický sealant", net: 400 },
          { label: "Keramika na 1 rok", net: 600 },
          { label: "Keramika na 2 roky", net: 800 },
          { label: "Keramika na 3 roky", net: 1000 }
        ]
      },
      {
        title: "S 2-krokovým leštením",
        desc: "Pre lak s hlbšími škrabancami. Najprv hrubšie leštenie, potom doleštenie do lesku.",
        layout: "tiles",
        items: [
          { label: "Keramika na 1 rok", net: 900 },
          { label: "Keramika na 2 roky", net: 1100 },
          { label: "Keramika na 3 roky", net: 1300 }
        ]
      }
    ]
  },
  {
    id: "umyvanie",
    title: "Umývanie",
    desc: "Ručné umývanie zvonka, zvnútra alebo komplet. Detailné umývanie ide do škár, mriežok a emblémov.",
    sections: [
      {
        title: "Základné umývanie",
        layout: "tiles",
        items: [
          { label: "Exteriér", net: 35 },
          { label: "Interiér", net: 35 },
          { label: "Komplet", sub: "exteriér + interiér", net: 70 }
        ]
      },
      {
        title: "Detailné umývanie",
        layout: "tiles",
        items: [
          { label: "Exteriér", net: 50 },
          { label: "Interiér", net: 50 },
          { label: "Komplet", sub: "exteriér + interiér", net: 100 }
        ]
      },
      {
        title: "Doplnkové služby",
        desc: "Pripočítavajú sa k programu umývania.",
        layout: "list",
        items: [
          { label: "Hĺbkové čistenie a impregnácia kože", sub: "k interiéru alebo kompletu", net: 200, plus: true },
          { label: "Hĺbkové čistenie a keramická ochrana kože", sub: "k interiéru alebo kompletu", net: 300, plus: true },
          { label: "Tepovanie jednej sedačky", sub: "k interiéru alebo kompletu", net: 20, plus: true },
          { label: "Tepovanie vozidla", sub: "k interiéru alebo kompletu", net: 150, plus: true },
          { label: "Keramická ochrana diskov", sub: "4 ks, k exteriéru alebo kompletu", net: 350, plus: true },
          { label: "Keramická ochrana čelného skla", sub: "k exteriéru alebo kompletu", net: 100, plus: true },
          { label: "Čistenie a impregnácia motorového priestoru", sub: "k exteriéru alebo kompletu", net: 50, plus: true },
          { label: "Dezinfekcia ozónom", sub: "ku každému programu", net: 20, plus: true }
        ]
      }
    ]
  }
];
