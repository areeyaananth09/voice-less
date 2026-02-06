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
        footer: "VOICELESS – A project by Tech Gen Innovations.",

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

        // About Page
        backToHome: "Back to Home",
        ourMission: "Our Mission:",
        connectingEveryVoice: "Connecting Every Voice",
        buildingBridges: "Building Bridges for the Deaf & Hard of Hearing Community",
        theProblem: "The Problem We're Solving",
        theProblemDesc: "The isolation faced by the deaf community is profound. Simple daily interactions can become insurmountable barriers, leading to social exclusion and frustration. We aim to break down these walls.",
        seamlessInteraction: "Introducing Seamless Interaction",
        realTimeTranslationTitle: "Real-Time Translation",
        realTimeTranslationDesc: "Instantly convert speech to text and sign breaking down communication barriers.",
        accessibleConversationsTitle: "Accessible Conversations",
        accessibleConversationsDesc: "Seamlessly convert in any situation for instant language changes and clarity.",
        accessibilityInclusion: "Accessibility & Inclusion",
        accessibilityInclusionDesc: "Engage freely beyond borders and finding our us in daily life.",
        ourSolution: "Our Solution",
        ourSolutionDesc: "Top-notch real-time tools that enable a seamless link back to great outcomes and stories. Visit us and experience a large life like never before.",
        ourStory: "Our Story",
        mindsBehind: "The Minds Behind Voiceless",
        ourStoryDesc: "Join us in creating for a more inclusive world. We are a passionate team dedicated to using technology for social good.",

        // Features Page
        featuresTitle: "Features",
        featuresSubtitle: "Discover What Makes Us Special",
        speechToText: "Speech to Text",
        speechToTextDesc: "Convert spoken words into written text in real-time with high accuracy.",
        textToSign: "Text to Sign Language",
        textToSignDesc: "Transform text into sign language animations for better understanding.",
        videoCallFeature: "Video Call Support",
        videoCallFeatureDesc: "Communicate face-to-face with integrated sign language support.",
        multiLanguageSupport: "Multi-Language Support",
        multiLanguageSupportDesc: "Support for multiple languages and regional sign languages.",

        // Role Selection Page
        chooseYourRole: "Choose Your Role",
        deafMute: "Deaf/Mute",
        deafMuteDesc: "I am deaf or mute and need communication assistance",
        hearing: "Hearing",
        hearingDesc: "I can hear and want to communicate with deaf/mute individuals",
        continue: "Continue",

        // Profile Page  
        myProfile: "My Profile",
        editYourProfile: "Edit Your Profile",
        uploadPhoto: "Upload Photo",
        fullName: "Full Name",
        emailAddress: "Email Address",
        phoneNumber: "Phone Number",
        dateOfBirth: "Date of Birth",
        gender: "Gender",
        male: "Male",
        female: "Female",
        other: "Other",
        preferNotToSay: "Prefer not to say",
        address: "Address",
        city: "City",
        state: "State",
        country: "Country",
        zipCode: "Zip Code",
        preferredLanguage: "Preferred Language",
        communicationPreference: "Communication Preference",
        signLanguage: "Sign Language",
        textChat: "Text Chat",
        voiceCall: "Voice Call",
        saveProfile: "Save Profile",
        discardChanges: "Discard Changes",
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

        // About Page
        backToHome: "முகப்புக்குத் திரும்பு",
        ourMission: "எங்கள் நோக்கம்:",
        connectingEveryVoice: "ஒவ்வொரு குரலையும் இணைத்தல்",
        buildingBridges: "காது கேளாதோர் மற்றும் கேட்பதில் சிரமம் உள்ளவர்களுக்கான பாலங்களை உருவாக்குதல்",
        theProblem: "நாங்கள் தீர்க்கும் பிரச்சனை",
        theProblemDesc: "காது கேளாத சமூகம் எதிர்கொள்ளும் தனிமை ஆழமானது. எளிய தினசரி தொடர்புகள் கடக்க முடியாத தடைகளாக மாறி, சமூக விலக்கு மற்றும் விரக்திக்கு வழிவகுக்கும். இந்த சுவர்களை உடைக்க நாங்கள் நோக்கமாக உள்ளோம்.",
        seamlessInteraction: "தடையற்ற தொடர்புகளை அறிமுகப்படுத்துதல்",
        realTimeTranslationTitle: "நேரடி மொழிபெயர்ப்பு",
        realTimeTranslationDesc: "பேச்சை உரையாகவும் சைகையாகவும் உடனடியாக மாற்றி தொடர்பு தடைகளை உடைக்கவும்.",
        accessibleConversationsTitle: "அணுகக்கூடிய உரையாடல்கள்",
        accessibleConversationsDesc: "உடனடி மொழி மாற்றங்கள் மற்றும் தெளிவுக்காக எந்த சூழ்நிலையிலும் தடையின்றி மாற்றவும்.",
        accessibilityInclusion: "அணுகல் மற்றும் உள்ளடக்கம்",
        accessibilityInclusionDesc: "எல்லைகளுக்கு அப்பால் சுதந்திரமாக ஈடுபடுங்கள் மற்றும் அன்றாட வாழ்க்கையில் நம்மைக் கண்டறியுங்கள்.",
        ourSolution: "எங்கள் தீர்வு",
        ourSolutionDesc: "சிறந்த முடிவுகள் மற்றும் கதைகளுக்கு தடையற்ற இணைப்பை செயல்படுத்தும் உயர்தர நேரடி கருவிகள். எங்களை பார்வையிட்டு முன்னெப்போதும் இல்லாத பெரிய வாழ்க்கையை அனுபவிக்கவும்.",
        ourStory: "எங்கள் கதை",
        mindsBehind: "குரலற்றவர்களுக்குப் பின்னால் உள்ள மனங்கள்",
        ourStoryDesc: "மேலும் உள்ளடக்கிய உலகத்தை உருவாக்க எங்களுடன் சேரவும். சமூக நலனுக்காக தொழில்நுட்பத்தைப் பயன்படுத்த அர்ப்பணிக்கப்பட்ட ஒரு உற்சாகமான குழு நாங்கள்.",

        // Features Page
        featuresTitle: "அம்சங்கள்",
        featuresSubtitle: "எங்களை சிறப்பாக்குவது என்ன என்பதைக் கண்டறியவும்",
        speechToText: "பேச்சு முதல் உரை வரை",
        speechToTextDesc: "பேசும் வார்த்தைகளை உயர் துல்லியத்துடன் நேரடியாக எழுதப்பட்ட உரையாக மாற்றவும்.",
        textToSign: "உரை முதல் சைகை மொழி வரை",
        textToSignDesc: "சிறந்த புரிதலுக்காக உரையை சைகை மொழி அனிமேஷன்களாக மாற்றவும்.",
        videoCallFeature: "வீடியோ அழைப்பு ஆதரவு",
        videoCallFeatureDesc: "ஒருங்கிணைந்த சைகை மொழி ஆதரவுடன் நேருக்கு நேர் தொடர்பு கொள்ளுங்கள்.",
        multiLanguageSupport: "பல மொழி ஆதரவு",
        multiLanguageSupportDesc: "பல மொழிகள் மற்றும் பிராந்திய சைகை மொழிகளுக்கான ஆதரவு.",

        // Role Selection Page
        chooseYourRole: "உங்கள் பங்கைத் தேர்வுசெய்யவும்",
        deafMute: "காது கேளாதவர்/ஊமை",
        deafMuteDesc: "நான் காது கேளாதவன் அல்லது ஊமை மற்றும் தொடர்பு உதவி தேவை",
        hearing: "கேட்கக்கூடியவர்",
        hearingDesc: "என்னால் கேட்க முடியும் மற்றும் காது கேளாத/ஊமை நபர்களுடன் தொடர்பு கொள்ள விரும்புகிறேன்",
        continue: "தொடரவும்",

        // Profile Page
        myProfile: "எனது சுயவிவரம்",
        editYourProfile: "உங்கள் சுயவிவரத்தைத் திருத்தவும்",
        uploadPhoto: "புகைப்படத்தைப் பதிவேற்றவும்",
        fullName: "முழு பெயர்",
        emailAddress: "மின்னஞ்சல் முகவரி",
        phoneNumber: "தொலைபேசி எண்",
        dateOfBirth: "பிறந்த தேதி",
        gender: "பாலினம்",
        male: "ஆண்",
        female: "பெண்",
        other: "மற்றவை",
        preferNotToSay: "சொல்ல விரும்பவில்லை",
        address: "முகவரி",
        city: "நகரம்",
        state: "மாநிலம்",
        country: "நாடு",
        zipCode: "அஞ்சல் குறியீடு",
        preferredLanguage: "விருப்பமான மொழி",
        communicationPreference: "தொடர்பு விருப்பம்",
        signLanguage: "சைகை மொழி",
        textChat: "உரை அரட்டை",
        voiceCall: "குரல் அழைப்பு",
        saveProfile: "சுயவிவரத்தைச் சேமி",
        discardChanges: "மாற்றங்களை நிராகரி",
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

        // About Page
        backToHome: "होम पर वापस जाएं",
        ourMission: "हमारा मिशन:",
        connectingEveryVoice: "हर आवाज को जोड़ना",
        buildingBridges: "बधिर और सुनने में कठिनाई वाले समुदाय के लिए पुल बनाना",
        theProblem: "हम जो समस्या हल कर रहे हैं",
        theProblemDesc: "बधिर समुदाय द्वारा सामना किया जाने वाला अलगाव गहरा है। सरल दैनिक बातचीत दुर्गम बाधाएं बन सकती हैं, जो सामाजिक बहिष्कार और निराशा की ओर ले जाती हैं। हम इन दीवारों को तोड़ने का लक्ष्य रखते हैं।",
        seamlessInteraction: "निर्बाध इंटरैक्शन का परिचय",
        realTimeTranslationTitle: "रीयल-टाइम अनुवाद",
        realTimeTranslationDesc: "भाषण को पाठ और सांकेतिक भाषा में तुरंत परिवर्तित करें, संचार बाधाओं को तोड़ें।",
        accessibleConversationsTitle: "सुलभ बातचीत",
        accessibleConversationsDesc: "तत्काल भाषा परिवर्तन और स्पष्टता के लिए किसी भी स्थिति में निर्बाध रूप से परिवर्तित करें।",
        accessibilityInclusion: "पहुंच और समावेशन",
        accessibilityInclusionDesc: "सीमाओं से परे स्वतंत्र रूप से संलग्न हों और दैनिक जीवन में खुद को खोजें।",
        ourSolution: "हमारा समाधान",
        ourSolutionDesc: "शीर्ष स्तर के रीयल-टाइम उपकरण जो महान परिणामों और कहानियों के लिए निर्बाध लिंक सक्षम करते हैं। हमसे मिलें और पहले कभी नहीं जैसा बड़ा जीवन अनुभव करें।",
        ourStory: "हमारी कहानी",
        mindsBehind: "वॉयसलेस के पीछे के दिमाग",
        ourStoryDesc: "अधिक समावेशी दुनिया बनाने में हमारे साथ शामिल हों। हम सामाजिक भलाई के लिए प्रौद्योगिकी का उपयोग करने के लिए समर्पित एक उत्साही टीम हैं।",

        // Features Page
        featuresTitle: "विशेषताएँ",
        featuresSubtitle: "जानें कि हमें क्या खास बनाता है",
        speechToText: "भाषण से पाठ",
        speechToTextDesc: "उच्च सटीकता के साथ बोले गए शब्दों को रीयल-टाइम में लिखित पाठ में परिवर्तित करें।",
        textToSign: "पाठ से सांकेतिक भाषा",
        textToSignDesc: "बेहतर समझ के लिए पाठ को सांकेतिक भाषा एनिमेशन में बदलें।",
        videoCallFeature: "वीडियो कॉल समर्थन",
        videoCallFeatureDesc: "एकीकृत सांकेतिक भाषा समर्थन के साथ आमने-सामने संवाद करें।",
        multiLanguageSupport: "बहु-भाषा समर्थन",
        multiLanguageSupportDesc: "कई भाषाओं और क्षेत्रीय सांकेतिक भाषाओं के लिए समर्थन।",

        // Role Selection Page
        chooseYourRole: "अपनी भूमिका चुनें",
        deafMute: "बधिर/मूक",
        deafMuteDesc: "मैं बधिर या मूक हूं और संचार सहायता की आवश्यकता है",
        hearing: "सुनने वाला",
        hearingDesc: "मैं सुन सकता हूं और बधिर/मूक व्यक्तियों के साथ संवाद करना चाहता हूं",
        continue: "जारी रखें",

        // Profile Page
        myProfile: "मेरी प्रोफ़ाइल",
        editYourProfile: "अपनी प्रोफ़ाइल संपादित करें",
        uploadPhoto: "फ़ोटो अपलोड करें",
        fullName: "पूरा नाम",
        emailAddress: "ईमेल पता",
        phoneNumber: "फ़ोन नंबर",
        dateOfBirth: "जन्म तिथि",
        gender: "लिंग",
        male: "पुरुष",
        female: "महिला",
        other: "अन्य",
        preferNotToSay: "नहीं बताना चाहते",
        address: "पता",
        city: "शहर",
        state: "राज्य",
        country: "देश",
        zipCode: "पिन कोड",
        preferredLanguage: "पसंदीदा भाषा",
        communicationPreference: "संचार प्राथमिकता",
        signLanguage: "सांकेतिक भाषा",
        textChat: "टेक्स्ट चैट",
        voiceCall: "वॉयस कॉल",
        saveProfile: "प्रोफ़ाइल सहेजें",
        discardChanges: "परिवर्तन रद्द करें",
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
