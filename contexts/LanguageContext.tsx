"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ta" | "hi";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navbar
        about: "About",
        howItWorks: "How it works",
        features: "Features",
        blog: "Blog",
        signIn: "Sign In",
        logout: "Logout",
        selectLanguage: "Select Language",

        // Homepage
        voiceless: "VOICELESS",
        connect: "Connect.",
        communicate: "Communicate.",
        empower: "Empower.",
        tagline: "Bridging Communication Gaps for the Deaf & Hard of Hearing.",
        getStarted: "GET STARTED",

        // Feature Cards
        realTimeTranslation: "Real-Time Translation",
        realTimeDesc: "Break down barriers with instant speech-to-text and sign language translation.",
        accessibleConversations: "Accessible Conversations",
        accessibleDesc: "Engage easily in scenarios from casual hangouts to professional meetings.",
        empoweringConnection: "Empowering Connection",
        empoweringDesc: "Engage equally across distances and platforms with seamless integration.",

        // Footer
        footer: "VOICELESS - A project by Tech Gen Innovations.",

        // Dashboard
        dashboard: "Dashboard",
        welcome: "Welcome",
        quickAccess: "Quick Access",
        twoWayChat: "Two-Way Chat",
        twoWayChatDesc: "Real-time text and sign language communication",
        videoCall: "Video Call",
        videoCallDesc: "Connect face-to-face with sign language support",
        weatherForecast: "Weather Forecast",
        temperature: "Temperature",
        humidity: "Humidity",
        windSpeed: "Wind Speed",
        recentActivity: "Recent Activity",
        noActivity: "No recent activity",

        // Profile
        profile: "Profile",
        personalInfo: "Personal Information",
        name: "Name",
        email: "Email",
        phone: "Phone",
        location: "Location",
        role: "Role",
        editProfile: "Edit Profile",
        saveChanges: "Save Changes",
        cancel: "Cancel",

        // Role Selection
        selectRole: "Select Your Role",
        farmer: "Farmer",
        farmerDesc: "Access farming tools and resources",
        consumer: "Consumer",
        consumerDesc: "Browse and purchase products",
        expert: "Expert",
        expertDesc: "Provide consultation and advice",
    },
    ta: {
        // Navbar
        about: "பற்றி",
        howItWorks: "எப்படி வேலை செய்கிறது",
        features: "அம்சங்கள்",
        blog: "வலைப்பதிவு",
        signIn: "உள்நுழைய",
        logout: "வெளியேறு",
        selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",

        // Homepage
        voiceless: "குரலற்றவர்",
        connect: "இணைக்கவும்.",
        communicate: "தொடர்பு கொள்ளுங்கள்.",
        empower: "அதிகாரம் அளிக்கவும்.",
        tagline: "காது கேளாதோர் மற்றும் கேட்பதில் சிரமம் உள்ளவர்களுக்கான தொடர்பு இடைவெளிகளை நிரப்புதல்.",
        getStarted: "தொடங்குங்கள்",

        // Feature Cards
        realTimeTranslation: "நேரடி மொழிபெயர்ப்பு",
        realTimeDesc: "உடனடி பேச்சு-உரை மற்றும் சைகை மொழி மொழிபெயர்ப்புடன் தடைகளை உடைக்கவும்.",
        accessibleConversations: "அணுகக்கூடிய உரையாடல்கள்",
        accessibleDesc: "சாதாரண சந்திப்புகள் முதல் தொழில்முறை கூட்டங்கள் வரை எளிதாக ஈடுபடுங்கள்.",
        empoweringConnection: "அதிகாரம் அளிக்கும் இணைப்பு",
        empoweringDesc: "தடையற்ற ஒருங்கிணைப்புடன் தூரங்கள் மற்றும் தளங்கள் முழுவதும் சமமாக ஈடுபடுங்கள்.",

        // Footer
        footer: "குரலற்றவர் - டெக் ஜென் இன்னோவேஷன்ஸ் திட்டம்.",

        // Dashboard
        dashboard: "டாஷ்போர்டு",
        welcome: "வரவேற்பு",
        quickAccess: "விரைவு அணுகல்",
        twoWayChat: "இருவழி அரட்டை",
        twoWayChatDesc: "நேரடி உரை மற்றும் சைகை மொழி தொடர்பு",
        videoCall: "வீடியோ அழைப்பு",
        videoCallDesc: "சைகை மொழி ஆதரவுடன் நேருக்கு நேர் இணைக்கவும்",
        weatherForecast: "வானிலை முன்னறிவிப்பு",
        temperature: "வெப்பநிலை",
        humidity: "ஈரப்பதம்",
        windSpeed: "காற்றின் வேகம்",
        recentActivity: "சமீபத்திய செயல்பாடு",
        noActivity: "சமீபத்திய செயல்பாடு இல்லை",

        // Profile
        profile: "சுயவிவரம்",
        personalInfo: "தனிப்பட்ட தகவல்",
        name: "பெயர்",
        email: "மின்னஞ்சல்",
        phone: "தொலைபேசி",
        location: "இடம்",
        role: "பங்கு",
        editProfile: "சுயவிவரத்தைத் திருத்து",
        saveChanges: "மாற்றங்களைச் சேமி",
        cancel: "ரத்துசெய்",

        // Role Selection
        selectRole: "உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்",
        farmer: "விவசாயி",
        farmerDesc: "விவசாய கருவிகள் மற்றும் வளங்களை அணுகவும்",
        consumer: "நுகர்வோர்",
        consumerDesc: "தயாரிப்புகளை உலாவவும் வாங்கவும்",
        expert: "நிபுணர்",
        expertDesc: "ஆலோசனை மற்றும் ஆலோசனை வழங்கவும்",
    },
    hi: {
        // Navbar
        about: "के बारे में",
        howItWorks: "यह कैसे काम करता है",
        features: "विशेषताएँ",
        blog: "ब्लॉग",
        signIn: "साइन इन करें",
        logout: "लॉग आउट",
        selectLanguage: "भाषा चुनें",

        // Homepage
        voiceless: "वॉयसलेस",
        connect: "जुड़ें।",
        communicate: "संवाद करें।",
        empower: "सशक्त बनाएं।",
        tagline: "बधिर और सुनने में कठिनाई वाले लोगों के लिए संचार अंतराल को पाटना।",
        getStarted: "शुरू करें",

        // Feature Cards
        realTimeTranslation: "रीयल-टाइम अनुवाद",
        realTimeDesc: "तत्काल भाषण-से-पाठ और सांकेतिक भाषा अनुवाद के साथ बाधाओं को तोड़ें।",
        accessibleConversations: "सुलभ बातचीत",
        accessibleDesc: "आकस्मिक मुलाकातों से लेकर पेशेवर बैठकों तक आसानी से शामिल हों।",
        empoweringConnection: "सशक्त कनेक्शन",
        empoweringDesc: "निर्बाध एकीकरण के साथ दूरियों और प्लेटफार्मों पर समान रूप से संलग्न हों।",

        // Footer
        footer: "वॉयसलेस - टेक जेन इनोवेशंस द्वारा एक परियोजना।",

        // Dashboard
        dashboard: "डैशबोर्ड",
        welcome: "स्वागत है",
        quickAccess: "त्वरित पहुँच",
        twoWayChat: "दो-तरफ़ा चैट",
        twoWayChatDesc: "रीयल-टाइम टेक्स्ट और सांकेतिक भाषा संचार",
        videoCall: "वीडियो कॉल",
        videoCallDesc: "सांकेतिक भाषा समर्थन के साथ आमने-सामने जुड़ें",
        weatherForecast: "मौसम पूर्वानुमान",
        temperature: "तापमान",
        humidity: "आर्द्रता",
        windSpeed: "हवा की गति",
        recentActivity: "हाल की गतिविधि",
        noActivity: "कोई हाल की गतिविधि नहीं",

        // Profile
        profile: "प्रोफ़ाइल",
        personalInfo: "व्यक्तिगत जानकारी",
        name: "नाम",
        email: "ईमेल",
        phone: "फ़ोन",
        location: "स्थान",
        role: "भूमिका",
        editProfile: "प्रोफ़ाइल संपादित करें",
        saveChanges: "परिवर्तन सहेजें",
        cancel: "रद्द करें",

        // Role Selection
        selectRole: "अपनी भूमिका चुनें",
        farmer: "किसान",
        farmerDesc: "कृषि उपकरण और संसाधनों तक पहुँचें",
        consumer: "उपभोक्ता",
        consumerDesc: "उत्पादों को ब्राउज़ करें और खरीदें",
        expert: "विशेषज्ञ",
        expertDesc: "परामर्श और सलाह प्रदान करें",
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        // Load language from localStorage on mount
        const savedLanguage = localStorage.getItem("language") as Language;
        if (savedLanguage && ["en", "ta", "hi"].includes(savedLanguage)) {
            setLanguageState(savedLanguage);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
