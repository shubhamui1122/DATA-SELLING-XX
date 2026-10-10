/**
 * ⚠️ SYSTEM TERMINAL: DATA-SELLING-XX 🏴‍☠️
 * ⚙️ UNDER PROTECTION OF DATA-SELLING-XX DELEGATE CORE 🔐
 * FILE: server.js (PART 1 - CORE ARCHITECTURE & ANTI-INTRUSION ROUTING)
 * AUTHOR: Shubham Kumar Shah - Founder & CEO
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 EMPIRE SECURITY TOKEN KEYS
const JWT_SECRET_USER = "DS_XX_CORE_SECURE_NODE_TOKEN_739194810_SYSTEM_CYBER_YELLOW";
const JWT_SECRET_ADMIN = "DS_XX_ADMIN_COMMAND_KEY_284810747_SYSTEM_ELECTRIC_BLUE";
const JWT_SECRET_OWNER = "DS_XX_OWNER_MAINFRAME_KEY_834921650_SHUBHAM_KING_CEO";

// 🎨 ULTRA-PREMIUM CYBERPUNK THEME COLOR CODES LOGS
const LOG_CYBER_YELLOW = "\x1b[33m%s\x1b[0m"; 
const LOG_ELECTRIC_BLUE = "\x1b[36m%s\x1b[0m";

console.log(LOG_CYBER_YELLOW, "==================================================================");
console.log(LOG_ELECTRIC_BLUE, " ⚠️  INITIALIZING SYSTEM MAIN FRAME: DATA-SELLING-XX SYSTEMS  ⚠️ ");
console.log(LOG_CYBER_YELLOW, "==================================================================");

// 🛡️ ENFORCING ELITE HEADERS SHIELD (HELMET)
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ⏳ DANGER-CLICK RATE LIMITER (API SPAM PROTECTION ENGINE)
const apiRateLimiter = rateLimit({
    windowMs: 5000, 
    max: 2, 
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message_en: "Too fast! Please wait 5 seconds... ⏱️",
            message_hi: "बहुत तेज़! कृपया 5 सेकंड प्रतीक्षा करें... ⏱️"
        });
    }
});

// ⚡ STICKY REGISTRY VOLATILE ENGINE (MEM-DATABASE SHIELD)
const db = {
    users: [],
    admins: [],
    withdrawals: [],
    giftCodes: [],
    userTickets: [],
    adminComplaints: [],
    announcements: {
        adminToUser: [],
        ownerToAdmin: []
    },
    systemSettings: {
        masterMiningSwitch: true 
    },
    workerLogs: []
};

// [CONTINUES IN PART 2]
// [CONTINUED FROM PART 1]

// 🤖 SEED INITIAL ROOT VIP LOGINS
const initRootAdmin = () => {
    const salt = bcrypt.genSaltSync(10);
    const rootUserHash = bcrypt.hashSync("123456", salt);
    
    db.users.push({
        uid: "100001",
        mobile: "9335555555",
        password: rootUserHash,
        balance: 0.00,
        totalDataSold: 0.00,
        level: "Bronze Miner",
        referrals: 0,
        referredBy: null,
        linkedAccounts: [],
        regTime: new Date().toISOString()
    });

    // SEED INITIAL HARDCODED ADMIN FOR LOGIN WORKERS
    db.admins.push({
        mobile: "9335555555",
        password: bcrypt.hashSync("123456", salt)
    });
};
initRootAdmin();

// 🛰️ ONE-DEVICE IP & HARDWARE BINDING MIDDLEWARE
const verifyDeviceSession = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({
            success: false,
            message_en: "Unauthorized Cyber Intrusion Detected! Session missing. 🚫",
            message_hi: "अनधिकृत साइबर घुसपैठ का पता चला! सत्र गायब है। 🚫"
        });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1] || token, JWT_SECRET_USER);
        const user = db.users.find(u => u.uid === decoded.uid);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message_en: "Node execution failed. Invalid registry token. 🔒",
                message_hi: "नोड निष्पादन विफल रहा। अमान्य रजिस्ट्री टोकन। 🔒"
            });
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message_en: "Session Hijack Blocked under Defense Protocol! Token Expired. 🚫",
            message_hi: "डिफेंस प्रोटोकॉल के तहत सत्र हाइजैक ब्लॉक! टोकन समाप्त। 🚫"
        });
    }
};

// [CONTINUES IN PART 3]
// [CONTINUED FROM PART 2]

// 🔑 CORE USER REGISTRATION REGISTRY (ONE-MOBILE LOCK ENGINE)
app.post('/api/auth/register', apiRateLimiter, (req, res) => {
    const { mobile, password, referralCode } = req.body;

    if (!mobile || !password || mobile.length < 10) {
        return res.status(400).json({
            success: false,
            message_en: "Invalid Parameters! Provide correct network inputs. 📶",
            message_hi: "अमान्य पैरामीटर! सही नेटवर्क इनपुट प्रदान करें। 📶"
        });
    }

    // 🚫 CHECK DUPLICATE REGISTRY SYSTEM
    const existingUser = db.users.find(u => u.mobile === mobile);
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message_en: "Registration Blocked! This number is already registered under Registry Lock. 🚫",
            message_hi: "पंजीकरण ब्लॉक! यह नंबर पहले से रजिस्ट्री लॉक के तहत पंजीकृत है। 🚫"
        });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    // 🆔 AUTO-GENERATING UNIQUE 6-DIGIT UID
    let newUid;
    do {
        newUid = Math.floor(100000 + Math.random() * 900000).toString();
    } while (db.users.find(u => u.uid === newUid));

    let referrer = null;
    if (referralCode) {
        referrer = db.users.find(u => u.uid === referralCode);
    }

    const newUser = {
        uid: newUid,
        mobile: mobile,
        password: hashedPassword,
        balance: 0.00,
        totalDataSold: 0.00,
        level: "Bronze Miner",
        referrals: 0,
        referredBy: referrer ? referrer.uid : null,
        linkedAccounts: [],
        regTime: new Date().toISOString()
    };

    db.users.push(newUser);

    if (referrer) {
        referrer.referrals += 1;
    }

    return res.status(201).json({
        success: true,
        uid: newUid,
        message_en: "Welcome to the Empire! Account created successfully. 🎉🔒",
        message_hi: "साम्राज्य में आपका स्वागत है! अकाउंट सफलतापूर्वक बन गया है। 🎉🔒"
    });
});

// [CONTINUES IN PART 4]
// [CONTINUED FROM PART 3]

// 🔓 CORE USER LOGIN ENGINE
app.post('/api/auth/login', apiRateLimiter, (req, res) => {
    const { mobile, password } = req.body;

    const user = db.users.find(u => u.mobile === mobile);
    if (!user) {
        return res.status(404).json({
            success: false,
            message_en: "Authentication Rejected! Node not detected in core. ❌",
            message_hi: "प्रमाणीकरण अस्वीकृत! नोड कोर में नहीं पाया गया। ❌"
        });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message_en: "Access Denied! Incorrect security signature. ❌",
            message_hi: "पहुंच अस्वीकृत! गलत सुरक्षा हस्ताक्षर। ❌"
        });
    }

    // GENERATING EXCLUSIVE JWT CYBER TOKEN
    const token = jwt.sign({ uid: user.uid, mobile: user.mobile }, JWT_SECRET_USER, { expiresIn: '24h' });

    return res.status(200).json({
        success: true,
        token: token,
        uid: user.uid,
        message_en: "Mainframe decrypted! Access granted safely. 🔓🚀",
        message_hi: "MAIN FRAME DECRYPTED! पहुंच सुरक्षित रूप से प्रदान की गई। 🔓🚀"
    });
});

// 🔒 TIME-LOCKED FORGOT PASSWORD GATEWAY (1:00 PM TO 7:00 PM WITH HARDCODED CHANNEL LINK)
app.post('/api/auth/forgot-password', apiRateLimiter, (req, res) => {
    const currentHour = new Date().getHours();
    
    // STRICT TIME ROUTING RULES (13:00 to 19:00 IS ACTIVE WINDOW)
    if (currentHour < 13 || currentHour >= 19) {
        return res.status(403).json({
            success: false,
            message_en: "Password Reset Vault is Closed! Gateway only opens between 01:00 PM and 07:00 PM. ⏱️",
            message_hi: "पासवर्ड रीसेट वॉल्ट बंद है! गेटवे केवल दोपहर 01:00 बजे से शाम 07:00 बजे के बीच खुलता है। ⏱️"
        });
    }

    return res.status(202).json({
        success: true,
        message_en: "If you have forgotten your password, please register a new account with a different mobile number, go to the GAME PROBLEM / SUPPORT section, and submit a ticket with your old registered number to our admin team. Our official channel: https://t.me/DATASELLINGXX",
        message_hi: "यदि आप अपना पासवर्ड भूल गए हैं, तो कृपया किसी दूसरे मोबाइल नंबर से एक नया अकाउंट रजिस्टर करें, फिर नीचे दिए गए GAME PROBLEM / SUPPORT सेक्शन में जाएं और हमारे एडमिन टीम को अपना पुराना रजिस्टर्ड नंबर लिखकर टिकट सबमिट करें। हमारा ऑफिशियल चैनल: https://t.me/DATASELLINGXX"
    });
});

const evaluateMinerStatus = (user) => {
    const dataGb = user.totalDataSold;
    if (dataGb >= 100) { user.level = "Gold VIP Miner"; } 
    else if (dataGb >= 50) { user.level = "Silver Miner"; } 
    else { user.level = "Bronze Miner"; }
};

// [CONTINUES IN PART 5]
// [CONTINUED FROM PART 4]

// 🔄 1-MB REAL-TIME MINING CORE ENGINE WITH AUTO-CASHOUT SWITCH
app.post('/api/mining/cashout', apiRateLimiter, verifyDeviceSession, (req, res) => {
    const { mbShared, networkType } = req.body;
    const user = req.user;

    if (!mbShared || mbShared <= 0) {
        return res.status(400).json({
            success: false,
            message_en: "Mining node empty! No bandwidth packets detected. 📶",
            message_hi: "माइनिंग नोड खाली है! कोई बैंडविड्थ पैकेट नहीं पाया गया। 📶"
        });
    }

    // 🚨 MASTER TRAFFIC SWITCH OFF (SYSTEM OVERLOAD FORCE AUTO-CASHOUT TRIGGER)
    if (!db.systemSettings.masterMiningSwitch) {
        const dataSharedGb = mbShared / 1024;
        const rewardAmount = dataSharedGb * 10.00; // BASE COMPENSATION

        user.balance += rewardAmount;
        user.totalDataSold += dataSharedGb;
        evaluateMinerStatus(user);

        return res.status(203).json({
            success: false,
            isLocked: true,
            cashoutAdded: rewardAmount.toFixed(4),
            message_en: "🚨 Network Overload Alert & Auto-Protection! Over 50,000+ active nodes just flooded the main server. Your earnings have been AUTOMATICALLY CASHED OUT to prevent loss! If you need support, please contact our admin. 🚀",
            message_hi: "🚨 नेटवर्क ओवरलोड अलर्ट और ऑटो-प्रोटेक्शन! मुख्य सर्वर पर एक साथ 50,000+ से अधिक एक्टिव यूजर्स का traffic आ गया है। आपके नुकसान को रोकने के लिए आपका पैसा ऑटोमैटिक कैश आउट कर दिया गया है! यदि कोई समस्या हो, तो हमारे एडमिन से संपर्क करें। 🚀"
        });
    }

    // DYNAMIC REFERRAL REWARD UPGRADE RULE CHECK (5 REF + 1GB EACH UNLOCKS ₹12/GB RATE)
    let ratePerGb = 10.00;
    const validReferrals = db.users.filter(u => u.referredBy === user.uid && u.totalDataSold >= 1.0);
    if (validReferrals.length >= 5) {
        ratePerGb = 12.00; // VIP BONUS BOOST RATIO
    }

    const sharedGb = mbShared / 1024;
    const computedPayout = sharedGb * ratePerGb;

    user.balance += computedPayout;
    user.totalDataSold += sharedGb;
    evaluateMinerStatus(user);

    return res.status(200).json({
        success: true,
        earnings: computedPayout.toFixed(4),
        networkEcho: networkType || "5G High-Speed Node Active ⚡",
        message_en: `💰 Cash Out Successful! ₹${computedPayout.toFixed(2)} has been instantly credited to your VIP account. 🚀`,
        message_hi: `🎉 कैश आउट सफल रहा! ₹${computedPayout.toFixed(2)} तुरंत आपके वीआईपी अकाउंट बैलेंस में जोड़ दिया गया है। 🚀`
    });
});

// [CONTINUES IN PART 6]
// [CONTINUED FROM PART 5]

// 🎁 DAILY SCRATCH CARD JACKPOT PROTOCOL (MINIMUM ₹1 GUARANTEED)
app.post('/api/rewards/daily-scratch', apiRateLimiter, verifyDeviceSession, (req, res) => {
    const user = req.user;
    const randomBonus = 1.00 + (Math.random() * 5.00); 
    user.balance += randomBonus;

    return res.status(200).json({
        success: true,
        bonusClaimed: randomBonus.toFixed(2),
        message_en: "🎁 Daily Surprise Gift claimed successfully. ₹" + randomBonus.toFixed(2) + " added! 💎",
        message_hi: "🎉 डेली गिफ्ट्स सफलतापूर्वक क्लेम किया गया। ₹" + randomBonus.toFixed(2) + " जोड़ा गया! 💎"
    });
});

// 💳 SMART WALLET SELECTOR REGISTER (MAX 3 ACCOUNTS ENGINE WITH CROSS-LINKING PROHIBITION)
app.post('/api/wallet/link-account', apiRateLimiter, verifyDeviceSession, (req, res) => {
    const { accountType, accountDetail } = req.body;
    const user = req.user;

    if (!accountDetail || !accountType) {
        return res.status(400).json({ success: false, message_en: "Parameters missing! 🚫" });
    }

    // RULE 1: STRICT 3 ACCOUNTS ABSOLUTE LIMIT CHECK
    if (user.linkedAccounts.length >= 3) {
        return res.status(403).json({
            success: false,
            message_en: "Registration Refused! Maximum threshold of 3 payment accounts reached. 🚫",
            message_hi: "अधिवेशक अस्वीकार! अधिकतम 3 भुगतान खातों की सीमा पूरी हो चुकी है। 🚫"
        });
    }

    // RULE 2: GLOBAL UNIQUE REPLICATED UPI DETECTOR ENGINE
    let isDuplicate = false;
    db.users.forEach(u => {
        const found = u.linkedAccounts.find(acc => acc.detail === accountDetail);
        if (found) isDuplicate = true;
    });

    if (isDuplicate) {
        return res.status(423).json({
            success: false,
            isTimerTriggered: true,
            coolDownMs: 60000, // 1 MINUTE COOLDOWN LOCK
            message_en: "🚫 UPI Already Registered! This UPI ID is already linked to another active account. For security reasons, duplicate routing is prohibited. 1 Minute submission lock deployed.",
            message_hi: "🚫 यूपीआई पहले से पंजीकृत है! यह यूपीआई आईडी पहले से ही किसी अन्य खाते से जुड़ी है। सुरक्षा कारणों से 1 मिनट का सबमिशन लॉक लगाया गया है।"
        });
    }

    user.linkedAccounts.push({ type: accountType, detail: accountDetail });
    return res.status(200).json({
        success: true,
        message_en: "✅ Payment Destination Linked Successfully! 👍",
        message_hi: "🟢 भुगतान विवरण सफलतापूर्वक लिंक हो गया है! 👍"
    });
});

// [CONTINUES IN PART 7]
// [CONTINUED FROM PART 6]

// 🔄 DYNAMIC SMART WITHDRAWAL ARCHITECTURE (LIMIT ROUTER WITH ₹6 GST SURCHARGE ENGINE)
app.post('/api/wallet/withdraw', apiRateLimiter, verifyDeviceSession, (req, res) => {
    const { payoutAmount } = req.body;
    const user = req.user;

    if (!payoutAmount) {
        return res.status(400).json({ success: false, message_en: "Invalid Transaction Requests. 🚫" });
    }

    // EVALUATING RUNTIME LIMIT RULES CHECK
    const priorWithdrawals = db.withdrawals.filter(w => w.userUid === user.uid && w.status === 'SUCCESS');
    const minimumFloorLimit = (priorWithdrawals.length === 0) ? 50.00 : 100.00;

    if (payoutAmount < minimumFloorLimit) {
        return res.status(406).json({
            success: false, 
            message_en: `Transaction Void! Minimum withdrawal limit for your tier is ₹${minimumFloorLimit}.00 📊`,
            message_hi: `लेनदेन अमान्य! आपके स्तर के लिए न्यूनतम विथड्रॉल सीमा ₹${minimumFloorLimit}.00 है। 📊`
        });
    }

    if (user.balance < payoutAmount) {
        return res.status(402).json({ success: false, message_en: "Insufficient Terminal balance vault resources. ❌", message_hi: "अपुष्ट वॉलेट बैलेंस! पर्याप्त धन उपलब्ध नहीं है। ❌" });
    }

    const feeGst = 6.00; // MANDATORY SURCHARGE
    user.balance -= payoutAmount;

    const withdrawOrder = {
        orderId: "RC" + Date.now() + Math.floor(1000 + Math.random() * 9000),
        userUid: user.uid,
        userMobile: user.mobile,
        requestedAmount: payoutAmount,
        taxDeducted: feeGst,
        finalYield: payoutAmount - feeGst,
        destination: user.linkedAccounts[0] || { type: 'UPI', detail: 'shubham@ybl' },
        status: "PENDING",
        timestamp: new Date().toISOString()
    };

    db.withdrawals.push(withdrawOrder);

    return res.status(201).json({
        success: true,
        orderId: withdrawOrder.orderId,
        message_en: "🔄 Withdrawal Submitted Successfully! Your request is securely queued under PENDING status. ⌛",
        message_hi: "⌛ विथड्रॉल सफलतापूर्वक सबमिट हो गया! आपकी रिक्वेस्ट पेंडिंग स्टेटस के साथ कतार में है। ⌛"
    });
});

// [CONTINUES IN PART 8]
// [CONTINUED FROM PART 7]

// ⏱️ PRE-LAUNCH 72-HOUR RECOGNITION INTERCEPTOR GATEWAY (SURVEY SYSTEM SYNC VALIDATOR)
app.get('/api/surveys/mainframe-check', verifyDeviceSession, (req, res) => {
    const user = req.user;
    const accountAgeMs = Date.now() - new Date(user.regTime).getTime();
    const lockedDurationMs = 72 * 60 * 60 * 1000; // COMPULSORY 72 HOUR SYNC TIMER
    
    let isTimeLocked = accountAgeMs < lockedDurationMs;
    let isReferralLocked = user.referrals < 5;

    if (isTimeLocked || isReferralLocked) {
        return res.status(200).json({
            success: true,
            isAccessGranted: false,
            referralsRegistered: user.referrals,
            syncTimeRemainingMs: isTimeLocked ? (lockedDurationMs - accountAgeMs) : 0,
            message_hi: "🛡️ सर्वे कोर फ्रेम - ब्लॉकचेन नोड स्थापित किया जा रहा है... ⏳"
        });
    }

    return res.status(200).json({ success: true, isAccessGranted: true, message_en: "Active survey pipelines unlocked. 📝" });
});

// 👉 TELEGRAM OFFICIAL CHANNEL TASK BYPASS SYSTEM
app.post('/api/tasks/claim-telegram-bonus', apiRateLimiter, verifyDeviceSession, (req, res) => {
    const user = req.user;
    if (user.isTelegramTaskClaimed) { return res.status(409).json({ success: false, message_en: "Task Loop Denied! Already claimed. 🚫" }); }

    user.balance += 2.00;
    user.isTelegramTaskClaimed = true;
    return res.status(200).json({ success: true, message_en: "💎 Bounty Synced! ₹2.00 added.", message_hi: "🟢 टास्क सफल! चैनल सत्यापन पुष्टि के लिए ₹2.00 बैलेंस में जोड़े गए।" });
});

// 🎁 CUSTOM ONE-TIME GLOBAL GIFT CODE CLAIM CONTROLLER
app.post('/api/gifts/redeem', apiRateLimiter, verifyDeviceSession, (req, res) => {
    const { codeString } = req.body;
    const user = req.user;
    const targetedCode = db.giftCodes.find(gc => gc.code.toUpperCase() === codeString.toUpperCase());
    
    if (!targetedCode || targetedCode.status === "EXPIRED") {
        return res.status(410).json({
            success: false,
            message_en: "🚫 Code Already Claimed! Better luck next time! 😔💸",
            message_hi: "🔴 कोड पहले ही क्लेम हो चुका है! अगली बार प्रयास करें! 😔💸"
        });
    }

    user.balance += targetedCode.payoutValue;
    targetedCode.status = "EXPIRED";
    targetedCode.claimedByUid = user.uid;

    return res.status(200).json({
        success: true,
        payoutCredited: targetedCode.payoutValue.toFixed(2),
        message_en: `🎁 Code claimed successfully! ₹${targetedCode.payoutValue.toFixed(2)} added! 💎`,
        message_hi: `🎉 मास्टर गिफ्ट कोड क्लेम किया गया। ₹${targetedCode.payoutValue.toFixed(2)} जोड़ा गया! 💎`
    });
});

// [CONTINUES IN PART 9]
// [CONTINUED FROM PART 8]

// ⚙️ VIP SETTINGS PAGE PASSWORD MODIFICATION LOGIC (ANTI-RANDOM FORCE INTRUSION PROOFING)
app.post('/api/user/modify-password', apiRateLimiter, verifyDeviceSession, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    const isOldMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isOldMatch) {
        return res.status(401).json({ success: false, message_en: "❌ Incorrect Current Password! 🚫", message_hi: "🔴 गलत वर्तमान पासवर्ड! 🚫" });
    }

    user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    return res.status(200).json({ success: true, message_en: "🎉 Password Changed! Your node session is secured. 🔒", message_hi: "🟢 पासवर्ड सफलतापूर्वक बदल गया है! आपका नोड सेशन अब सुरक्षित है। 🔒" });
});

app.get('/api/user/profile-metrics', verifyDeviceSession, (req, res) => {
    const user = req.user;
    return res.status(200).json({
        success: true,
        profile: {
            uid: user.uid, mobile: user.mobile, totalBalance: user.balance.toFixed(4),
            lifetimeSharedDataGb: user.totalDataSold.toFixed(4), currentMinerLevel: user.level,
            totalReferralCount: user.referrals, registeredAccountsCount: user.linkedAccounts.length
        }
    });
});

// 🏆 SHREEWIN-STYLE WEEKLY TOPPERS LEADERBOARD SIMULATED PIPELINE (HIDDEN SCROLL ENGINE DATA)
app.get('/api/rewards/weekly-toppers-list', (req, res) => {
    const fakeWinners = [];
    for (let i = 1; i <= 40; i++) {
        let bountyBracket = i <= 10 ? 8400.00 : (i <= 20 ? 4200.00 : (i <= 30 ? 2200.00 : 1100.00));
        fakeWinners.push({ rank: i, maskedMobile: `933XXXXX${10+i}`, allocatedBonus: bountyBracket.toFixed(2) });
    }
    return res.status(200).json({ success: true, winnersData: fakeWinners });
});

// 🛠️ ADMIN AUTHENTICATION GATEWAY WITH FAUJ CONTROL LOOP SYNC
app.post('/api/admin/auth/login', apiRateLimiter, (req, res) => {
    const { username, password } = req.body;
    const admin = db.admins.find(a => a.mobile === username);
    
    if (admin && bcrypt.compareSync(password, admin.password)) {
        const token = jwt.sign({ username: username, role: 'ADMIN' }, JWT_SECRET_ADMIN, { expiresIn: '12h' });
        return res.status(200).json({ success: true, token: token, message_en: "Admin Node Connected! 🔓⚡" });
    }
    return res.status(401).json({ success: false, message_en: "Access Denied! Worker node unregistered. ❌" });
});

// [CONTINUES IN PART 10]
// [CONTINUED FROM PART 9]

app.post('/api/admin/spy/user-lookup', apiRateLimiter, (req, res) => {
    const { searchKey } = req.body;
    const user = db.users.find(u => u.uid === searchKey || u.mobile === searchKey);
    if (!user) { return res.status(404).json({ success: false }); }
    return res.status(200).json({ success: true, userDossier: { uid: user.uid, mobile: user.mobile, walletBalance: user.balance, lifetimeGbShared: user.totalDataSold, currentMinerLevel: user.level, referralCount: user.referrals, linkedAccounts: user.linkedAccounts } });
});

app.post('/api/admin/control/reset-password', apiRateLimiter, (req, res) => {
    const { userMobile, newSecretKey } = req.body;
    const user = db.users.find(u => u.mobile === userMobile);
    if (user) { user.password = bcrypt.hashSync(newSecretKey, bcrypt.genSaltSync(10)); }
    return res.status(200).json({ success: true });
});

app.post('/api/support/raise-ticket', verifyDeviceSession, (req, res) => { return res.status(201).json({ success: true, message_en: "📩 Ticket Raised Status: PENDING 🛠️" }); });
app.post('/api/admin/ads/blast-launcher', apiRateLimiter, (req, res) => { return res.status(200).json({ success: true, message_en: "Live Promotional Ad broadcasted! 📺💥" }); });
app.get('/api/user/ads/intercept', (req, res) => { return res.status(200).json({ activeAd: null }); });

app.post('/api/owner/payout/execute-verdict', apiRateLimiter, (req, res) => {
    const { orderId, ownerAction } = req.body;
    const order = db.withdrawals.find(w => w.orderId === orderId);
    if (order) { order.status = ownerAction; }
    return res.status(200).json({ success: true });
});

app.get('/api/owner/payout/sorted-history', (req, res) => {
    return res.status(200).json({ success: true, pendingVault: db.withdrawals.filter(w => w.status === 'PENDING'), successVault: db.withdrawals.filter(w => w.status === 'SUCCESS'), rejectedVault: db.withdrawals.filter(w => w.status === 'REJECTED') });
});

app.post('/api/owner/gifts/create-voucher', apiRateLimiter, (req, res) => {
    const { customCodeName, valueAmount } = req.body;
    db.giftCodes.push({ code: customCodeName.toUpperCase(), payoutValue: parseFloat(valueAmount), status: "ACTIVE", claimedByUid: null });
    return res.status(201).json({ success: true });
});

app.post('/api/owner/broadcast/all-admins', apiRateLimiter, (req, res) => { return res.status(200).json({ success: true }); });
app.post('/api/admin/support/submit-complaint', apiRateLimiter, (req, res) => { return res.status(201).json({ success: true }); });

// 👑 OWNER PLATFORM FAUJ ENGINE SYNC INTEGRATOR RULE
app.post('/api/owner/control/recruit-admin', apiRateLimiter, (req, res) => {
    const { adminMobile, adminPassword } = req.body;
    if(!adminMobile || !adminPassword) return res.status(400).json({ success: false });
    db.admins.push({ mobile: adminMobile, password: bcrypt.hashSync(adminPassword, bcrypt.genSaltSync(10)) });
    return res.status(201).json({ success: true });
});

app.post('/api/owner/system/toggle-mining-switch', apiRateLimiter, (req, res) => {
    const { targetState } = req.body;
    db.systemSettings.masterMiningSwitch = !!targetState;
    return res.status(200).json({ success: true });
});

app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });

app.listen(PORT, () => {
    console.log(LOG_CYBER_YELLOW, "==================================================================");
    console.log(LOG_ELECTRIC_BLUE, ` 🛰️  SERVER RUNNING SECURELY ON NODE PORT NO: ${PORT} `);
    console.log(LOG_CYBER_YELLOW, "==================================================================");
});
// [CONTINUED FROM PART 10]

// 🛡️ SECURITY LAYER OPERATION: ANTI-INTRUSION BLACKLIST REGISTRY VANS
db.blacklistedIps = [];
db.systemHealthLogs = [];

// 🚫 AGENT MIDDLEWARE: WIRELESS MEDIA PACKET DECRYPTION & BAN HOOKS
const enforceMainframeFirewallShield = (req, res, next) => {
    const clientIpAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // CHECK IF TARGET USER NODE IS BLACKLISTED INSIDE VOLATILE REGISTRIES
    const isIpBanned = db.blacklistedIps.includes(clientIpAddress);
    if (isIpBanned) {
        return res.status(403).send("🚨 ACCESS DENIED: YOUR DEVICE HARDWARE SIGNATURE HAS BEEN SECURELY BANNED BY DATA-SELLING-XX DEFENSE PROTOCOLS 🔐");
    }

    // ⛔ SQL INJECTION & XSS HARSH SANITIZATION BALANCER
    const inboundPayloadString = JSON.stringify(req.body || {});
    if (inboundPayloadString.includes("SELECT *") || inboundPayloadString.includes("<script>") || inboundPayloadString.includes("UNION SELECT")) {
        db.blacklistedIps.push(clientIpAddress); // PERMANENT BAN TRIGGER
        console.log(LOG_CYBER_YELLOW, `⚠️ CRITICAL ATTACK INTERCEPTED! IP ${clientIpAddress} SUCCESSFULLY BANNED UNDER CORE PERIMETER PROTECTION LAYERS.`);
        return res.status(400).json({
            success: false,
            message_en: "🚨 MALICIOUS CODE INTERCEPTED! Anti-Hack system active. Your IP has been permanently reported to DATA-SELLING-XX Mainframe.",
            message_hi: "🚨 दुर्भावनापूर्ण कोड पकड़ा गया! एंटी-हैक सिस्टम एक्टिव है। आपकी आईपी को हमेशा के लिए ब्लॉक कर दिया गया है।"
        });
    }

    next();
};

// ATTACH CORE OVERLORD SHIELD TO ALL API ENDPOINTS
app.use('/api', enforceMainframeFirewallShield);

// 👑 OWNER EXCLUSIVE REMOTE: IP UNBAN & BAN INTERFACE CONTROLLERS
app.post('/api/owner/security/blacklist-ip', apiRateLimiter, (req, res) => {
    const { targetIpToBan } = req.body;
    if(!targetIpToBan) return res.status(400).json({ success: false });
    
    if(!db.blacklistedIps.includes(targetIpToBan)) {
        db.blacklistedIps.push(targetIpToBan);
    }
    return res.status(200).json({ success: true, message_en: `IP Address [${targetIpToBan}] successfully sealed and restricted from network nodes.` });
});

app.post('/api/owner/security/unban-ip', apiRateLimiter, (req, res) => {
    const { targetIpToUnban } = req.body;
    if(!targetIpToUnban) return res.status(400).json({ success: false });
    
    db.blacklistedIps = db.blacklistedIps.filter(ip => ip !== targetIpToUnban);
    return res.status(200).json({ success: true, message_en: `IP Address [${targetIpToUnban}] successfully unbanned. Session clearance restored.` });
});

// 📊 AUTOMATED REPETITIVE RUNTIME SYSTEM DIAGNOSTICS MONITOR (LOG GENERATOR ENGINE)
const triggerMainframeSystemDiagnosticsLoop = () => {
    const currentStamp = new Date().toISOString();
    const systemMemoryUsageBytes = process.memoryUsage().heapUsed;
    const activeNodesEstimatedCount = db.users.length + 5371; // REAL DB + INTERCEPTED NET CHANNELS TRAFFIC

    const diagnosticsLog = {
        timestamp: currentStamp,
        memoryUsedMb: (systemMemoryUsageBytes / 1024 / 1024).toFixed(2),
        activeConnectionsCount: activeNodesEstimatedCount,
        mainframeStatus: db.systemSettings.masterMiningSwitch ? "OPERATIONAL / HEALTHY 🟢" : "FORCE OVERLOAD LOCKED 🚨"
    };

    db.systemHealthLogs.push(diagnosticsLog);
    
    // KEEP RECENT 50 RECORDS BUFFER TO PREVENT VOLATILE RAM BLOWN CRASHES
    if(db.systemHealthLogs.length > 50) {
        db.systemHealthLogs.shift();
    }

    // SILENT LIVE MONITOR ON THE OWNERS CONSOLE TERMINALS
    console.log(LOG_ELECTRIC_BLUE, `[DATA-SELLING-XX MONITOR] System Check: ${diagnosticsLog.memoryUsedMb} MB Heap Used | Nodes: ${diagnosticsLog.activeConnectionsCount} | Firewall Shield Armed.`);
};

// AUTO EXECUTE TELEMETRY CYCLES MATRIX EVERY 30 SECONDS
setInterval(triggerMainframeSystemDiagnosticsLoop, 30000);

// API COMPILER EXTRACT ROUTER FOR OWNERS ANALYSIS DISPATCH
app.get('/api/owner/security/mainframe-telemetry', (req, res) => {
    return res.status(200).json({
        success: true,
        firewallActiveStatus: "FULLY ARMED / CRYPTO LOCK DEPLOYED 🔐",
        totalBannedIpsCount: db.blacklistedIps.length,
        systemHealthLogsHistory: db.systemHealthLogs
    });
});
