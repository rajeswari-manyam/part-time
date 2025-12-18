import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locals/en.json"
import hi from "./locals/hi.json"
import ta from "./locals/ta.json";
import te from "./locals/te.json";
import kn from "./locals/kn.json";
import ml from "./locals/ml.json";
import bn from "./locals/bn.json";
import mr from "./locals/mr.json";
import gu from "./locals/gu.json";
import pa from "./locals/pa.json";
import or from "./locals/or.json";
import as from "./locals/as.json";
import ur from "./locals/ur.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        hi: { translation: hi },
        ta: { translation: ta },
        te: { translation: te },
        kn: { translation: kn },
        ml: { translation: ml },
        bn: { translation: bn },
        mr: { translation: mr },
        gu: { translation: gu },
        pa: { translation: pa },
        or: { translation: or },
        as: { translation: as },
        ur: { translation: ur },
    },
    lng: localStorage.getItem("lang") || "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
