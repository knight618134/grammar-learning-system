import fs from "node:fs";
import path from "node:path";

const units = [
  {
    unit: 1,
    title: "Present continuous (I am doing)",
    goal: "Use present continuous for actions happening now or around now.",
    zhGoal: "學會用現在進行式表達正在發生、或最近一段時間正在進行的事。",
    points: [
      ["A. Form / 形式", "am/is/are + -ing", "be 動詞 + V-ing"],
      ["B. Now / 現在正在", "Use it for actions happening at the moment.", "用來說現在正在做的事。"],
      ["C. Around now / 最近一段時間", "Use it for temporary situations around now.", "用來說最近暫時正在進行的狀態。"]
    ],
    examples: ["I am reviewing Unit 1 now.", "Jason is building a grammar system.", "This app is becoming more useful."],
    confusion: ["Do not forget am/is/are.", "中：不要只寫 V-ing，前面要有 am/is/are。"],
    wrong: ["Wrong: I reviewing grammar.", "Correct: I am reviewing grammar."],
    summary: "Present continuous = am/is/are + -ing for now or around now."
  },
  {
    unit: 2,
    title: "Present simple (I do)",
    goal: "Use present simple for habits, facts, routines, and general truths.",
    zhGoal: "學會用現在簡單式表達習慣、事實、例行動作和一般真理。",
    points: [
      ["A. Habits / 習慣", "Use present simple for repeated actions.", "重複發生的動作用現在簡單式。"],
      ["B. Facts / 事實", "Use it for facts and general truths.", "事實和一般真理用現在簡單式。"],
      ["C. He/She/It + s / 第三人稱單數", "Add -s or -es with he/she/it.", "he/she/it 後面的動詞要加 s 或 es。"]
    ],
    examples: ["I review grammar every day.", "This unit explains habits.", "Jason studies English after work."],
    confusion: ["Present simple is not only about the present moment.", "中：現在簡單式常常是在講習慣，不是正在發生。"],
    wrong: ["Wrong: Jason study English.", "Correct: Jason studies English."],
    summary: "Present simple = habits, facts, routines."
  },
  {
    unit: 3,
    title: "Present continuous and present simple 1 (I am doing and I do)",
    goal: "Choose between actions happening now and regular habits.",
    zhGoal: "分辨正在發生的動作和固定習慣。",
    points: [
      ["A. Now vs Habit / 正在 vs 習慣", "I am doing = now. I do = habit.", "I am doing 是正在；I do 是習慣。"],
      ["B. Temporary vs Permanent / 暫時 vs 長期", "Continuous often feels temporary.", "進行式常有暫時感。"],
      ["C. Signal Words / 提示字", "now, today, these days often suggest continuous.", "now, today, these days 常提示進行式。"]
    ],
    examples: ["I usually review at night.", "I am reviewing Unit 3 right now.", "Jason works in tech, but he is studying grammar these days."],
    confusion: ["Do not use present continuous for every present sentence.", "中：不是所有現在的句子都用現在進行式。"],
    wrong: ["Wrong: I am usually review at night.", "Correct: I usually review at night."],
    summary: "Use continuous for now/temporary; simple for habits/facts."
  },
  {
    unit: 4,
    title: "Present continuous and present simple 2 (I am doing and I do)",
    goal: "Understand verbs that are usually not used in continuous form.",
    zhGoal: "理解有些狀態動詞通常不用進行式。",
    points: [
      ["A. State Verbs / 狀態動詞", "Verbs like know, believe, understand often describe states.", "know, believe, understand 常表示狀態。"],
      ["B. Action Verbs / 動作動詞", "Action verbs can often use continuous.", "動作動詞通常可以用進行式。"],
      ["C. Meaning Change / 意思改變", "Some verbs change meaning in continuous form.", "有些動詞用進行式時意思會變。"]
    ],
    examples: ["I understand the rule now.", "I am thinking about the answer.", "I know this pattern."],
    confusion: ["Say I understand, not I am understanding in normal use.", "中：一般說 I understand，不說 I am understanding。"],
    wrong: ["Wrong: I am knowing the answer.", "Correct: I know the answer."],
    summary: "Use simple for many state verbs; continuous for actions."
  },
  {
    unit: 5,
    title: "Past simple (I did)",
    goal: "Use past simple for completed actions in the past.",
    zhGoal: "用過去簡單式表達過去已完成的動作。",
    points: [
      ["A. Finished Past / 已完成的過去", "Use past simple for actions completed at a past time.", "過去某時間完成的事用過去簡單式。"],
      ["B. Time Markers / 時間標記", "yesterday, last week, in 2020 often suggest past simple.", "yesterday, last week, in 2020 常提示過去式。"],
      ["C. Did Questions / did 問句", "Use did + base verb in questions and negatives.", "問句和否定用 did + 原形。"]
    ],
    examples: ["I reviewed Unit 5 yesterday.", "Jason made a mistake.", "Did you check the answer?"],
    confusion: ["After did, use base verb.", "中：did 後面接原形動詞。"],
    wrong: ["Wrong: Did you checked it?", "Correct: Did you check it?"],
    summary: "Past simple = completed past action."
  },
  {
    unit: 6,
    title: "Past continuous (I was doing)",
    goal: "Use past continuous for actions in progress at a past time.",
    zhGoal: "用過去進行式表達過去某時正在發生的動作。",
    points: [
      ["A. Form / 形式", "was/were + -ing", "was/were + V-ing"],
      ["B. In Progress / 正在進行", "Use it for an action continuing at a past moment.", "用來說過去某一刻正在進行。"],
      ["C. Background Action / 背景動作", "It often gives background for another past action.", "常用來當另一個過去動作的背景。"]
    ],
    examples: ["I was reviewing when you called.", "Jason was checking the passive form.", "The app was running locally."],
    confusion: ["Past continuous is about duration or background.", "中：過去進行式常強調當時正在進行。"],
    wrong: ["Wrong: I was review when you called.", "Correct: I was reviewing when you called."],
    summary: "Past continuous = was/were + -ing for past action in progress."
  },
  {
    unit: 7,
    title: "Present perfect 1 (I have done)",
    goal: "Use present perfect for past actions connected to now.",
    zhGoal: "用現在完成式表達和現在有關聯的過去動作。",
    points: [
      ["A. Form / 形式", "have/has + past participle", "have/has + 過去分詞"],
      ["B. Connection To Now / 連到現在", "The result or experience matters now.", "重點是結果或經驗和現在有關。"],
      ["C. No Finished Time / 不說明確過去時間", "Do not use it with finished time markers like yesterday.", "不要和 yesterday 這種明確過去時間一起用。"]
    ],
    examples: ["I have finished Unit 7.", "Jason has saved the notes.", "Have you checked the answer?"],
    confusion: ["Present perfect is not the same as past simple.", "中：現在完成式不是單純過去式。"],
    wrong: ["Wrong: I have finished it yesterday.", "Correct: I finished it yesterday."],
    summary: "Present perfect = past action with present connection."
  },
  {
    unit: 8,
    title: "Present perfect 2 (I have done)",
    goal: "Use present perfect for experience and unfinished time.",
    zhGoal: "用現在完成式表達經驗和還沒結束的時間範圍。",
    points: [
      ["A. Experience / 經驗", "Use it for life experience without saying exactly when.", "不說確切時間的經驗用現在完成式。"],
      ["B. Unfinished Time / 未結束時間", "Use it with today, this week, this year when the period is not finished.", "today, this week 等未結束時間可用現在完成式。"],
      ["C. Ever/Never / 曾經/從未", "Ever and never are common with present perfect.", "ever/never 常和現在完成式一起用。"]
    ],
    examples: ["I have studied passive before.", "Jason has made progress this week.", "Have you ever confused been and being?"],
    confusion: ["If you say exactly when, past simple is often better.", "中：如果說明確時間，通常用過去簡單式。"],
    wrong: ["Wrong: I have studied it last night.", "Correct: I studied it last night."],
    summary: "Use present perfect for experience and unfinished time."
  },
  {
    unit: 9,
    title: "Present perfect continuous (I have been doing)",
    goal: "Use present perfect continuous for actions continuing until now or recently.",
    zhGoal: "用現在完成進行式表達一直持續到現在或最近剛在做的事。",
    points: [
      ["A. Form / 形式", "have/has been + -ing", "have/has been + V-ing"],
      ["B. Continuing Action / 持續動作", "Use it for actions that started before now and continue.", "從過去開始，持續到現在。"],
      ["C. Recent Activity / 最近活動", "Use it when recent activity explains the present result.", "最近做的事造成現在結果。"]
    ],
    examples: ["I have been reviewing grammar.", "Jason has been building this app.", "It has been getting easier."],
    confusion: ["This form emphasizes activity or duration.", "中：這個時態強調活動本身或持續多久。"],
    wrong: ["Wrong: I have been review grammar.", "Correct: I have been reviewing grammar."],
    summary: "Present perfect continuous = have/has been + -ing."
  },
  {
    unit: 10,
    title: "Present perfect continuous and simple (I have been doing and I have done)",
    goal: "Choose between activity focus and result focus.",
    zhGoal: "分辨現在完成進行式的活動焦點，和現在完成式的結果焦點。",
    points: [
      ["A. Activity / 活動", "Have been doing emphasizes the activity or duration.", "have been doing 強調活動或持續。"],
      ["B. Result / 結果", "Have done emphasizes completion or result.", "have done 強調完成或結果。"],
      ["C. Both Can Be Possible / 兩者都可能", "Choose by what you want to emphasize.", "依照你想強調活動還是結果來選。"]
    ],
    examples: ["I have been writing notes.", "I have written three unit notes.", "Jason has been studying, and he has improved."],
    confusion: ["Ask: activity or finished result?", "中：先問自己要強調活動，還是完成結果。"],
    wrong: ["Wrong: I have been finished the note.", "Correct: I have finished the note."],
    summary: "Have been doing = activity; have done = result."
  },
  {
    unit: 11,
    title: "how long have you (been) ... ?",
    goal: "Ask and answer about duration until now.",
    zhGoal: "學會詢問和回答持續到現在多久。",
    points: [
      ["A. How Long / 多久", "Use how long for duration.", "how long 問持續多久。"],
      ["B. Have Been Doing / 一直在做", "Use have been doing for ongoing activities.", "持續活動常用 have been doing。"],
      ["C. Have Known / 狀態動詞", "Some state verbs use present perfect simple.", "狀態動詞常用現在完成式。"]
    ],
    examples: ["How long have you been studying grammar?", "I have been studying for two hours.", "How long have you known this rule?"],
    confusion: ["Use present perfect forms for duration continuing to now.", "中：持續到現在的時間長度常用完成式。"],
    wrong: ["Wrong: How long do you study grammar?", "Better: How long have you been studying grammar?"],
    summary: "How long + present perfect asks duration until now."
  },
  {
    unit: 12,
    title: "for and since when ... ? and how long ... ?",
    goal: "Use **for** and **since** with duration.",
    zhGoal: "學會用 **for** 和 **since** 表達持續時間。",
    points: [
      ["A. For / 一段時間", "Use for + length of time.", "for + 一段時間。"],
      ["B. Since / 起點", "Use since + starting point.", "since + 起始時間。"],
      ["C. How Long / 問多久", "Use how long to ask about duration.", "用 how long 問持續多久。"]
    ],
    examples: ["I have studied for two hours.", "I have studied since 8 p.m.", "How long have you used this app?"],
    confusion: ["For is length; since is starting point.", "中：for 是多久；since 是從何時開始。"],
    wrong: ["Wrong: I have studied since two hours.", "Correct: I have studied for two hours."],
    summary: "For = duration; since = starting point."
  },
  {
    unit: 13,
    title: "Present perfect and past 1 (I have done and I did)",
    goal: "Choose between present perfect and past simple.",
    zhGoal: "分辨現在完成式和過去簡單式。",
    points: [
      ["A. Present Perfect / 現在完成", "Use it when the result or experience matters now.", "結果或經驗和現在有關。"],
      ["B. Past Simple / 過去簡單", "Use it with a finished past time.", "明確過去時間用過去簡單式。"],
      ["C. Time Mentioned / 有說時間", "If you say when, past simple is usually right.", "有說何時，通常用過去式。"]
    ],
    examples: ["I have finished the note.", "I finished it yesterday.", "Jason has learned the pattern."],
    confusion: ["Do not use present perfect with finished past time.", "中：不要把現在完成式和明確過去時間混在一起。"],
    wrong: ["Wrong: I have finished it yesterday.", "Correct: I finished it yesterday."],
    summary: "Have done connects to now; did belongs to finished past time."
  },
  {
    unit: 14,
    title: "Present perfect and past 2 (I have done and I did)",
    goal: "Use present perfect for new information and past simple for details.",
    zhGoal: "用現在完成式引入新資訊，再用過去式說細節。",
    points: [
      ["A. New Information / 新資訊", "Present perfect often introduces news or experience.", "現在完成式常用來帶出新資訊或經驗。"],
      ["B. Details / 細節", "Past simple often gives when/how details.", "過去式常用來說何時、如何發生。"],
      ["C. Conversation Flow / 對話流程", "Start with have done, continue with did.", "先用 have done，引出後再用 did 補細節。"]
    ],
    examples: ["I have made a mistake. I chose the wrong tense.", "Jason has updated the notes. He changed Unit 43 yesterday.", "I have read this rule before."],
    confusion: ["English often switches tense after the first sentence.", "中：英文常先用完成式，再切到過去式說細節。"],
    wrong: ["Wrong: I have made a mistake yesterday.", "Correct: I made a mistake yesterday."],
    summary: "Use present perfect for news, past simple for past details."
  },
  {
    unit: 15,
    title: "Past perfect (I had done)",
    goal: "Use past perfect for an action before another past time.",
    zhGoal: "用過去完成式表達比另一個過去時間更早發生的事。",
    points: [
      ["A. Earlier Past / 更早的過去", "Use had done for an action before another past action.", "比另一個過去動作更早，用 had done。"],
      ["B. Form / 形式", "had + past participle", "had + 過去分詞"],
      ["C. Clarity / 清楚順序", "It helps show which past action happened first.", "幫助說清楚過去事件順序。"]
    ],
    examples: ["I had reviewed Unit 42 before I studied Unit 43.", "Jason had saved the note before the app restarted.", "The answer had been corrected."],
    confusion: ["Past perfect is about past-before-past.", "中：過去完成式是過去中的更早過去。"],
    wrong: ["Wrong: I had review it before.", "Correct: I had reviewed it before."],
    summary: "Past perfect = had done for earlier past."
  },
  {
    unit: 16,
    title: "Past perfect continuous (I had been doing)",
    goal: "Use past perfect continuous for an activity continuing before a past time.",
    zhGoal: "用過去完成進行式表達在某個過去時間前一直持續的活動。",
    points: [
      ["A. Form / 形式", "had been + -ing", "had been + V-ing"],
      ["B. Duration Before Past / 過去之前的持續", "Use it for activity continuing up to a past time.", "持續到某個過去時間之前。"],
      ["C. Cause / 原因", "It can explain why something was true then.", "可用來解釋當時狀態的原因。"]
    ],
    examples: ["I had been reviewing for an hour before the test.", "Jason was tired because he had been studying.", "The system had been running all night."],
    confusion: ["Had been doing emphasizes activity before a past point.", "中：強調某個過去時間之前一直在做。"],
    wrong: ["Wrong: I had been review.", "Correct: I had been reviewing."],
    summary: "Past perfect continuous = had been + -ing before a past time."
  },
  {
    unit: 17,
    title: "have and have got",
    goal: "Use **have** and **have got** for possession and related meanings.",
    zhGoal: "學會用 **have / have got** 表達擁有、關係、身體狀態等。",
    points: [
      ["A. Possession / 擁有", "Have and have got can both mean possess.", "have 和 have got 都可表示擁有。"],
      ["B. Questions / 問句", "Use do/does with have; use have/has with have got.", "have 問句常用 do/does；have got 用 have/has。"],
      ["C. American/British / 語感差異", "Have got is especially common in British English.", "have got 在英式英文很常見。"]
    ],
    examples: ["I have a grammar notebook.", "I've got a question.", "Jason has a review plan."],
    confusion: ["Do not mix forms: Do you have...? / Have you got...?", "中：不要混：Do you have...? / Have you got...?"],
    wrong: ["Wrong: Do you have got a question?", "Correct: Do you have a question?"],
    summary: "Have and have got can both show possession, but their question forms differ."
  },
  {
    unit: 18,
    title: "used to (do)",
    goal: "Use **used to** for past habits or past states that are no longer true.",
    zhGoal: "用 **used to** 表達過去習慣或過去狀態，現在已經不同。",
    points: [
      ["A. Past Habit / 過去習慣", "Used to describes repeated past actions.", "used to 可描述過去常做的事。"],
      ["B. Past State / 過去狀態", "Used to can describe past states.", "used to 也可描述過去狀態。"],
      ["C. No Longer True / 現在不同", "It often suggests the situation changed.", "通常表示現在已經不同。"]
    ],
    examples: ["I used to avoid grammar.", "Jason used to confuse wish and hope.", "This used to be difficult."],
    confusion: ["Use base verb after used to.", "中：used to 後面接原形動詞。"],
    wrong: ["Wrong: I used to studied grammar.", "Correct: I used to study grammar."],
    summary: "Used to = past habit/state that is not true now."
  },
  {
    unit: 19,
    title: "Present tenses (I am doing / I do) for the future",
    goal: "Use present tenses for future arrangements and schedules.",
    zhGoal: "學會用現在式表達未來安排和固定時程。",
    points: [
      ["A. Present Continuous / 未來安排", "Use am/is/are doing for personal arrangements.", "用現在進行式表達已安排好的未來計畫。"],
      ["B. Present Simple / 固定時程", "Use present simple for timetables and schedules.", "用現在簡單式表達固定時刻表。"],
      ["C. Context / 看語境", "Future meaning comes from time words or context.", "未來意思常由時間字或語境看出。"]
    ],
    examples: ["I am reviewing Unit 20 tomorrow.", "The class starts at 7.", "Jason is meeting a tutor next week."],
    confusion: ["Present form can have future meaning.", "中：現在式也可以表達未來。"],
    wrong: ["Wrong: The class is start at 7.", "Correct: The class starts at 7."],
    summary: "Present continuous = arrangement; present simple = schedule."
  },
  {
    unit: 20,
    title: "I'm going to (do)",
    goal: "Use **be going to** for intentions and evidence-based predictions.",
    zhGoal: "用 **be going to** 表達打算，以及根據跡象做出的預測。",
    points: [
      ["A. Intention / 打算", "Use going to for plans or intentions.", "用 going to 表達已經有的打算。"],
      ["B. Evidence / 有跡象", "Use going to when something seems likely from evidence.", "根據眼前跡象判斷會發生。"],
      ["C. Form / 形式", "am/is/are going to + base verb", "am/is/are going to + 原形動詞。"]
    ],
    examples: ["I am going to review Unit 43.", "This mistake is going to appear again if I ignore it.", "Jason is going to add notes."],
    confusion: ["Going to needs be: am/is/are.", "中：going to 前面要有 be。"],
    wrong: ["Wrong: I going to study.", "Correct: I am going to study."],
    summary: "Going to = intention or prediction from evidence."
  },
  {
    unit: 21,
    title: "will and shall 1",
    goal: "Use **will** for decisions, promises, offers, and predictions.",
    zhGoal: "用 **will** 表達臨時決定、承諾、提供幫助和預測。",
    points: [
      ["A. Instant Decision / 臨時決定", "Use will when deciding now.", "當下決定常用 will。"],
      ["B. Promise/Offer / 承諾/提供", "Will can make promises or offers.", "will 可用於承諾或提供幫忙。"],
      ["C. Prediction / 預測", "Will can predict what you think will happen.", "will 可表示你認為會發生的事。"]
    ],
    examples: ["I will fix that mistake.", "I will review it tonight.", "This system will help Jason learn."],
    confusion: ["Will is not only future; it can be a decision now.", "中：will 不只是未來，也常是當下決定。"],
    wrong: ["Wrong: I will to review.", "Correct: I will review."],
    summary: "Will = decision, promise, offer, prediction."
  },
  {
    unit: 22,
    title: "will and shall 2",
    goal: "Use **will** and **shall** in questions, offers, and suggestions.",
    zhGoal: "學會在問句、提議、提供幫忙中使用 will / shall。",
    points: [
      ["A. Will You...? / 請求", "Use will you for requests or willingness.", "will you 可問對方願不願意。"],
      ["B. Shall I...? / 我來...好嗎", "Use shall I for offers.", "shall I 可用來主動提供幫忙。"],
      ["C. Shall We...? / 我們...好嗎", "Use shall we for suggestions.", "shall we 可用來提議一起做。"]
    ],
    examples: ["Will you check this answer?", "Shall I add this to wrong answers?", "Shall we review Passive first?"],
    confusion: ["Shall is common in offers/suggestions, especially with I/we.", "中：shall 常和 I/we 搭配，用於提議或提供。"],
    wrong: ["Wrong: Shall you review this?", "Better: Will you review this?"],
    summary: "Shall I/we is useful for offers and suggestions."
  },
  {
    unit: 23,
    title: "I will and I'm going to",
    goal: "Choose between **will** and **going to**.",
    zhGoal: "分辨 **will** 和 **going to** 的使用時機。",
    points: [
      ["A. Will / 當下決定", "Use will for decisions made now.", "當下決定用 will。"],
      ["B. Going To / 已有計畫", "Use going to for intentions or plans already made.", "已有打算或計畫用 going to。"],
      ["C. Prediction / 預測", "Both can predict; going to often uses visible evidence.", "兩者都可預測；going to 常有眼前跡象。"]
    ],
    examples: ["I will fix it now.", "I am going to review Unit 24 tonight.", "Look at the errors. This is going to need review."],
    confusion: ["Ask: decided now or planned before?", "中：先問是當下決定，還是之前就計畫好。"],
    wrong: ["Wrong: I am going fix it.", "Correct: I am going to fix it."],
    summary: "Will = decision now; going to = plan or evidence."
  },
  {
    unit: 24,
    title: "will be doing and will have done",
    goal: "Use future continuous and future perfect.",
    zhGoal: "學會使用未來進行式和未來完成式。",
    points: [
      ["A. Will Be Doing / 未來某時正在", "Use will be doing for an action in progress at a future time.", "未來某時間正在做，用 will be doing。"],
      ["B. Will Have Done / 未來某時已完成", "Use will have done for completion before a future time.", "未來某時間之前完成，用 will have done。"],
      ["C. Time Point / 時間點", "These forms often need a future reference point.", "這些時態常需要未來時間點。"]
    ],
    examples: ["At 9, I will be reviewing grammar.", "By tomorrow, I will have finished Unit 24.", "Jason will have built a strong review system."],
    confusion: ["Be doing = in progress; have done = completed.", "中：be doing 是正在；have done 是完成。"],
    wrong: ["Wrong: By tomorrow, I will finish already.", "Better: By tomorrow, I will have finished."],
    summary: "Will be doing = future in progress; will have done = completed before future time."
  },
  {
    unit: 25,
    title: "when I do and when I've done if and when",
    goal: "Use present forms after when/if for future meaning.",
    zhGoal: "學會在 when/if 後面用現在式表達未來。",
    points: [
      ["A. After When/If / when/if 後", "Use present simple for future meaning after when and if.", "when/if 後用現在式表達未來。"],
      ["B. When I've Done / 做完之後", "Use present perfect for completion before a future point.", "用現在完成式表示未來某事之前已完成。"],
      ["C. If vs When / 如果 vs 當", "If means uncertain; when means expected.", "if 是不確定；when 是預期會發生。"]
    ],
    examples: ["When I finish Unit 25, I will review Unit 26.", "If I have time, I will practice.", "When I have finished this note, I will push it."],
    confusion: ["Do not use will right after when/if in basic future time clauses.", "中：基本未來時間/條件子句裡，when/if 後不要直接用 will。"],
    wrong: ["Wrong: When I will finish, I will review.", "Correct: When I finish, I will review."],
    summary: "After when/if, use present forms for future meaning."
  }
];

const unitsDir = path.join(process.cwd(), "content", "units");

for (const unit of units) {
  const core = unit.points
    .map(
      ([heading, en, zh]) => [
        `### ${heading}`,
        `EN: ${en}`,
        "",
        `中：${zh}`
      ].join("\n")
    )
    .join("\n\n");

  const list = (items) => items.map((item) => `- ${item}`).join("\n");

  const body = [
    "---",
    `unit: ${unit.unit}`,
    `title: ${unit.title}`,
    "---",
    "",
    "## Learning Goal",
    `EN: ${unit.goal}`,
    "",
    `中：${unit.zhGoal}`,
    "",
    "## Core Grammar",
    core,
    "",
    "## Examples",
    list(unit.examples),
    "",
    "## Jason's Confusing Points",
    list(unit.confusion),
    "",
    "## Wrong Answers",
    list(unit.wrong),
    "",
    "## One-line Summary",
    `EN: ${unit.summary}`,
    "",
    "中：本單元重點請看上方公式、例句和常錯點；複習時先確認時態和動詞形式。",
    ""
  ].join("\n");

  fs.writeFileSync(path.join(unitsDir, `unit-${unit.unit}.mdx`), body);
}
