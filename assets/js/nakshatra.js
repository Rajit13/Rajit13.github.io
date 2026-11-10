/* বাংলা জ্যোতির্বিজ্ঞান অভিধান: ভারতীয় নক্ষত্র ও আরবি lunar mansion comparison.
   Rows are aligned by historical station order, not by identical stellar membership.
   Columns: Bengali name | Bengali book (modernized) | constellation bn/en | Indian associated stars | Arabic mansion (transliteration) | Arabic script | English book (modern Bengali paraphrase).
*/
(()=>{
"use strict";
const raw=[
"অশ্বিনী||অশ্বের মুখের মতো বিন্যাসে তিনটি তারা নিয়ে নক্ষত্রটি চিহ্নিত করা হয়েছে।||মেষ / Aries||Sheratan (\\(\\beta\\) Ari), Mesarthim (\\(\\gamma\\) Ari)||Al-Sheratau (Al-Sharatayn)||الشرطان||মেষের মাথার দুটি উজ্জ্বল তারা। এদের দিয়েই আরবি চন্দ্রমঞ্জিলের ধারাবাহিকতা শুরু।",
"ভরণী||তিনটি তারা মিলে একটি ত্রিভুজাকার নক্ষত্রসমষ্টি।||মেষ / Aries||35 Ari, 39 Ari, 41 Ari||Al-Botein (Al-Butayn)||البطين||আরবি ‘বাতন’ অর্থ উদর বা পেট। মেষের পেটের কাছে কয়েকটি ছোট তারা।",
"কৃত্তিকা||ছয়টি তারা মিলে অগ্নিশিখার মতো বিন্যাস; এর Pleiades একটি মুক্ত তারা স্তবক।||বৃষ / Taurus||তারা স্তবক Pleiades (M45); দেবসেনা / Alcyone (\\(\\eta\\) Tau)||Al-Thuraiya (Al-Thurayyā)||الثريا||গ্রন্থকার ‘থারওয়া’ শব্দের অর্থ করেছেন প্রচুর বা প্রাচুর্যপূর্ণ। এটি Pleiades (কৃত্তিকা তারা স্তবক)।",
"রোহিণী||পাঁচটি তারা নিয়ে গরুর গাড়ি বা চাকার মতো একটি আকৃতি কল্পনা করা হয়েছে।||বৃষ / Taurus||রোহিণী / Aldebaran (\\(\\alpha\\) Tau)||Al-Debasan (Al-Dabarān)||الدبران||প্রকৃত অর্থে Hyades তারা স্তবক; সাধারণভাবে বৃষের মাথার উজ্জ্বল Aldebaran। আরবি নাম ‘Ain al-Thawr’, অর্থ বৃষের চোখ।",
"মৃগশিরা||তিনটি তারার বিন্যাসকে হরিণের মাথার সঙ্গে তুলনা করা হয়েছে।||কালপুরুষ / Orion||Meissa (\\(\\lambda\\) Ori), \\(\\phi\\) Ori||Al-Hekah (Al-Haqʿa)||الهقعة||Orion (কালপুরুষ) তারামণ্ডলীর মাথার তিনটি তারা।",
"আর্দ্রা||একটি উজ্জ্বল লালচে তারা দিয়ে নক্ষত্রটি চিহ্নিত; আধুনিক নাম Betelgeuse।||কালপুরুষ / Orion||আর্দ্রা / Betelgeuse (\\(\\alpha\\) Ori)||Al-Henah (Al-Hanʿa)||الهنعة||মিথুন তারামণ্ডলীর দুই পায়ের মাঝামাঝি দুটি তারা; ভারতীয় আর্দ্রার Betelgeuse নয়।",
"পুনর্বসু||চারটি তারার বিন্যাসে ঘর এবং তার মধ্যে ছোট একটি কুটিরের আকৃতি কল্পনা করা হয়েছে।||মিথুন / Gemini||Castor (\\(\\alpha\\) Gem), Pollux (\\(\\beta\\) Gem)||Al-Dira (Al-Dhirāʿ)||الذراع||মিথুনের দুই যমজের মাথার দুটি উজ্জ্বল তারা—Castor ও Pollux।",
"পুষ্যা||ছয়টি তারায় গঠিত, তীরের মতো আকৃতির নক্ষত্রসমষ্টি।||কর্কট / Cancer||Asellus Borealis (\\(\\gamma\\) Cnc), Asellus Australis (\\(\\delta\\) Cnc), \\(\\theta\\) Cnc||Al-Nethra (Al-Nathra)||النثرة||সিংহের মুখের অংশ হিসেবে বর্ণিত; এটি আরবি চন্দ্রমঞ্জিলের প্রাচীন প্রতীকী পরিচয়।",
"অশ্লেষা||পাঁচটি তারার বিন্যাসকে কুণ্ডলী পাকানো বৃত্তের মতো কল্পনা করা হয়েছে।||হৃদসর্প / Hydra||\\(\\delta\\), \\(\\epsilon\\), \\(\\eta\\), \\(\\rho\\), \\(\\sigma\\) Hya||Al-Terpha (Al-Tarf)||الطرف||সিংহের চোখের অঞ্চল।",
"মঘা||পাঁচটি তারাকে কেন্দ্র করে চতুষ্কোণ খাট, সিংহাসন বা মন্দিরের প্রতীকী আকৃতি।||সিংহ / Leo||মঘা / Regulus (\\(\\alpha\\) Leo)||Al-Giebha (Al-Jabha)||الجبهة||সিংহের কপাল। আল-ফারগানির মতে সিংহ মণ্ডলের চারটি উজ্জ্বল তারা, যার একটি Cor Leonis (‘সিংহের হৃৎপিণ্ড’, Regulus)।",
"পূর্বফাল্গুনী||দুটি তারায় গঠিত খাটের মতো আকৃতি।||সিংহ / Leo||Zosma (\\(\\delta\\) Leo), Chertan (\\(\\theta\\) Leo)||Al-Zubra (Al-Zubra)||الزبرة||সিংহের হৃৎপিণ্ডের পরবর্তী দুটি উজ্জ্বল তারা।",
"উত্তরফাল্গুনী||চারটি তারার সাহায্যে খাটের ওপর বিছানার মতো আকৃতি কল্পনা করা হয়েছে।||সিংহ / Leo||উত্তর ফাল্গুনী / Denebola (\\(\\beta\\) Leo)||Al-Serpha (Al-Sarfa)||الصرفة||সিংহের লেজের উজ্জ্বল তারা।",
"হস্তা||পাঁচটি তারার সমষ্টি; মানুষের হাতের মতো বিন্যাস।||করতল / Corvus||Alchiba (\\(\\alpha\\) Crv), Kraz (\\(\\beta\\) Crv), \\(\\gamma\\), \\(\\delta\\), \\(\\epsilon\\) Crv||Al-Auwa (Al-ʿAwwāʾ)||العواء||কন্যা তারামণ্ডলীর নিচের দিকে পাঁচটি তারা।",
"চিত্রা||মুক্তার মতো উজ্জ্বল একটি প্রধান তারা।||কন্যা / Virgo||চিত্রা / Spica (\\(\\alpha\\) Vir)||Sinak-Al-Azal (Al-Simāk al-Aʿzal)||السماك الأعزل||কন্যার হাতে শস্যশীষের উজ্জ্বল তারা Spica; আরবি পূর্ণ নাম Al-Simāk al-Aʿzal।",
"স্বাতী||প্রধানত একটি উজ্জ্বল তারা দিয়ে নক্ষত্রটিকে চিহ্নিত করা হয়।||বুটিস / Boötes||স্বাতী / Arcturus (\\(\\alpha\\) Boo)||Al-Gaphr (Al-Ghafr)||الغفر||কন্যা তারামণ্ডলীর পায়ের কাছে তিনটি তারা; ভারতীয় স্বাতীর Arcturus একই তারা নয়।",
"বিশাখা||চারটি তারা নিয়ে একাধিক শাখাযুক্ত বা চতুষ্কোণ আকৃতি কল্পনা করা হয়েছে।||তুলা / Libra||Zubenelgenubi (\\(\\alpha\\) Lib), Zubeneschamali (\\(\\beta\\) Lib), \\(\\gamma\\), \\(\\iota\\) Lib||Al-Zubana (Al-Zubānā)||الزبانا||দাঁড়িপাল্লা বা ভারসাম্য, বর্তমান তুলা (Libra) তারামণ্ডলের অংশ।",
"অনুরাধা||চারটি তারা প্রায় এক সরল সারিতে আছে বলে বর্ণিত।||বৃশ্চিক / Scorpius||Acrab (\\(\\beta\\) Sco), Dschubba (\\(\\delta\\) Sco), Fang (\\(\\pi\\) Sco)||Au-Iclil (Al-Iklīl)||الإكليل||‘উত্তরের মুকুট’ নামে মুকুটসদৃশ বিন্যাস। এটি আধুনিক Corona Borealis তারামণ্ডল বোঝায় না; বৃশ্চিকের মাথার কাছের অঞ্চল।",
"জ্যেষ্ঠা||তিনটি তারার বিন্যাস কানের কুণ্ডলের মতো।||বৃশ্চিক / Scorpius||জ্যেষ্ঠ / Antares (\\(\\alpha\\) Sco), \\(\\sigma\\), \\(\\tau\\) Sco||Al-Kalb (Al-Qalb)||القلب||বৃশ্চিকের হৃৎপিণ্ড, বিশেষত উজ্জ্বল Antares।",
"মূলা||এগারোটি তারাকে শুঁটি বা গোছার মতো আকৃতির সঙ্গে তুলনা করা হয়েছে।||বৃশ্চিক / Scorpius||\\(\\epsilon\\), \\(\\zeta\\), \\(\\eta\\), \\(\\theta\\), \\(\\iota\\), \\(\\kappa\\), \\(\\lambda\\), \\(\\mu\\), \\(\\nu\\) Sco||Al-Shaula (Al-Shawla)||الشولة||বৃশ্চিকের লেজের দুটি তারা।",
"পূর্বাষাঢ়া||চারটি তারার সমষ্টি; হাতির দাঁতের মতো প্রতীকী আকৃতি।||ধনু / Sagittarius||Kaus Media (\\(\\delta\\) Sgr), Kaus Australis (\\(\\epsilon\\) Sgr)||Al-Naaim (Al-Naʿāʾim)||النعائم||আটটি উজ্জ্বল তারা—চারটি আকাশগঙ্গা ছায়াপথের উজ্জ্বল অঞ্চলের মধ্যে, চারটি বাইরে। ভেতরের দল ‘Al-Warida’ (‘পানির দিকে যাওয়া উট’); বাইরের দল ‘Al-Sadira’ (‘পানি থেকে ফিরে আসা উট’)।",
"উত্তরাষাঢ়া||চারটি তারার সমষ্টি; খাট ও বিছানার মতো আকৃতি।||ধনু / Sagittarius||Ascella (\\(\\zeta\\) Sgr), Nunki (\\(\\sigma\\) Sgr)||Al-Belda (Al-Balda)||البلدة||ড. হাইডের দেওয়া লাতিন ব্যাখ্যায় নামটির অর্থ ‘নগর’ বা ‘শহর’। কারও মতে ধনু মণ্ডলের ছয়টি তারা—সেই যুগের বর্ণনায় এখানে বছরের ক্ষুদ্রতম দিনের সূর্য থাকত; অন্যদের মতে আল-নাঈমের পরের তারাবিরল অঞ্চল। লেখক প্রশ্ন করেন, ফাঁকা অঞ্চলকে ‘শহর’ কেন বলা হবে, এবং ছয়টি তারার ঘন বিন্যাসকে নামের কারণ মনে করেন।",
"অভিজিৎ (অতিরিক্ত)||তিনটি তারার বিন্যাস নিয়ে প্রাচীন বর্ণনা; এটি প্রচলিত ২৭টির বাইরে অতিরিক্ত নক্ষত্র।||বীণা / Lyra||অভিজিৎ / Vega (\\(\\alpha\\) Lyr)||Al-Dabih (Saʿd al-Dhābiḥ)||سعد الذابح||মকর তারামণ্ডলীর চারটি তারা; ভারতীয় অভিজিতের Vega তারার সঙ্গে একই নয়।",
"শ্রবণা||তিনটি তারার বিন্যাসে তিনটি পদচিহ্ন বা পদতলের প্রতীক কল্পনা করা হয়েছে।||ঈগল / Aquila||শ্রবণা / Altair (\\(\\alpha\\) Aql), \\(\\beta\\), \\(\\gamma\\) Aql||Sad-Al-Bula (Saʿd Bulaʿ)||سعد بلع||উলুঘ বেগের কুম্ভ তারামণ্ডলীর তালিকায় ষষ্ঠ তারা। গ্রন্থকারের অনুমান, Bayer-এর \\(\\gamma\\) চিহ্নিত তারা হতে পারে।",
"ধনিষ্ঠা||পাঁচটি তারা মিলে মৃদঙ্গের মতো আকৃতি।||ডেলফিনাস / Delphinus||Sualocin (\\(\\alpha\\) Del), Rotanev (\\(\\beta\\) Del), \\(\\gamma\\), \\(\\delta\\) Del||Al-Sund (Saʿd al-Suʿūd)||سعد السعود||কুম্ভ তারামণ্ডলীর দুটি তারা; গ্রন্থে Bayer-এর \\(\\rho\\) এবং \\(\\xi\\) চিহ্নের উল্লেখ।",
"শতভিষা||প্রতীকী বর্ণনায় একশো তারার বৃত্তাকার সমষ্টি; এটি আধুনিক তারা গণনা নয়।||কুম্ভ / Aquarius||Sadachbia (\\(\\gamma\\) Aqr)||Al-Achbiya (Saʿd al-Akhbiya)||سعد الأخبية||কুম্ভ তারামণ্ডলীর আরও চারটি তারা; মূল বর্ণনায় Bayer-এর \\(\\gamma\\), \\(\\xi\\), \\(\\eta\\) ও \\(\\theta\\) চিহ্নের উল্লেখ আছে। আধুনিক তালিকার শনাক্তকরণ আলাদা হতে পারে।",
"পূর্বভাদ্রপদ||দুটি তারায় গঠিত; খাটের ওপর বিছানার মতো আকৃতি।||পক্ষীরাজ / Pegasus||Markab (\\(\\alpha\\) Peg), Scheat (\\(\\beta\\) Peg)||Al-Phergh—Al-Mukaddem (Al-Fargh al-Muqaddam)||الفرغ المقدم||Pegasus তারামণ্ডলীর দুটি উজ্জ্বল তারা। উত্তরের তারাটিকে পক্ষীরাজের কাঁধ বলা হয়েছে; Bayer-এর \\(\\alpha\\) ও \\(\\beta\\) চিহ্নিত তারা।",
"উত্তরভাদ্রপদ||দুটি তারার বিন্যাসকে প্রাচীন গ্রন্থে মৎস্যাকৃতির সঙ্গে তুলনা করা হয়েছে।||পক্ষীরাজ ও অ্যানড্রোমিডা / Pegasus & Andromeda||Algenib (\\(\\gamma\\) Peg), Alpheratz (\\(\\alpha\\) And)||Al-Phergh—Al-Muacher (Al-Fargh al-Muʾakhkhar)||الفرغ المؤخر||আগের আল-ফার্গের পরের দুটি দূরবর্তী উজ্জ্বল তারা। একটি Andromeda-র মাথায়, অপরটি Pegasus-এর ডানার প্রান্তে (Bayer-এর \\(\\gamma\\))।",
"রেবতী||বত্রিশটি তারা মিলে মাদলের মতো বিন্যাস—এমনই ঐতিহ্যিক বর্ণনা দেওয়া হয়েছে।||মীন / Pisces||Revati (\\(\\zeta\\) Psc)||Al-Risha (Al-Rishāʾ)||الرشاء||‘দড়ি’ বা মাছ দুটিকে যুক্ত করা বন্ধন। আল-ফারগানি ‘Batu al-Hut’ (‘মাছের পেট’) নামও উল্লেখ করেছেন; তাঁর মতে এতে উত্তর দিকের মাছের তারাগুলো বোঝায়।"
].join("\n");

const rows=raw.split("\n").map(line=>line.split("||"));
if(rows.length!==28||rows.some(r=>r.length!==7)){console.error("Nakshatra data alignment error");return;}
const root=document.getElementById("nakshatra-table-root");
if(!root)return;
const css=document.createElement("style");
css.textContent=[
"#nakshatra-panel .nak-intro{font-family:Kalpurush,system-ui,sans-serif;font-size:1.05rem;line-height:1.9}",
"#nakshatra-panel .nak-intro p{max-width:1050px}",
"#nakshatra-panel .nak-intro h3{font-size:1.25rem;margin:23px 0 8px;color:#dceaff}",
"#nakshatra-panel .nak-formula{padding:18px 22px;margin:13px 0;border:1px solid #435269;border-radius:11px;background:#151e2b;overflow-x:auto}",
"#nakshatra-panel .nak-formula p{margin:6px 0}",
"#nakshatra-panel .nak-warning{border-left:5px solid var(--amber);padding:14px 17px;background:#262115;border-radius:8px;color:#f2dfbd}",
"#nakshatra-panel .nak-brief{border-left:4px solid var(--green);padding:12px 16px;background:#162a2a;border-radius:8px}",
"#nakshatra-panel .nak-controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin:22px 0 12px}",
"#nakshatra-panel .nak-controls input[type=search]{background:#111923;border:1px solid #4b607a;border-radius:8px;color:var(--text);min-width:245px;max-width:100%;padding:10px 12px;font:inherit}",
"#nakshatra-panel .nak-controls label{font-family:Kalpurush,system-ui,sans-serif}",
"#nakshatra-panel .nak-check{display:inline-flex;gap:7px;align-items:center;white-space:nowrap}",
"#nakshatra-panel .nak-count{color:var(--muted);font-size:.87rem}",
"#nakshatra-panel table{min-width:1450px;table-layout:fixed}",
"#nakshatra-panel th,#nakshatra-panel td{padding:12px 14px;vertical-align:top;text-align:left;line-height:1.6}",
"#nakshatra-panel th:nth-child(1){width:14%}",
"#nakshatra-panel th:nth-child(2){width:25%}",
"#nakshatra-panel th:nth-child(3){width:15%}",
"#nakshatra-panel th:nth-child(4){width:19%}",
"#nakshatra-panel th:nth-child(5){width:14%}",
"#nakshatra-panel th:nth-child(6){width:25%}",
"#nakshatra-panel .nak-first{font-weight:750;color:var(--green)}",
"#nakshatra-panel .nak-first small{display:block;color:var(--muted);font-weight:400}",
"#nakshatra-panel .nak-arabic{display:block;color:#dbddf4;font-family:serif;font-size:1.06rem;direction:rtl;text-align:left}",
"#nakshatra-panel .nak-latin{font-family:Georgia,serif;color:#e7edf8}",
"#nakshatra-panel .nak-extra{background:rgba(245,196,123,.095)}",
"#nakshatra-panel .nak-mismatch{color:var(--amber);font-size:.82em}",
"#nakshatra-panel .nak-table-note{font-size:.95rem;color:#c5d0df;margin:12px 0}",
"@media(max-width:650px){#nakshatra-panel .nak-controls{align-items:stretch}#nakshatra-panel .nak-controls input{width:100%}}"
].join("\n");
document.head.append(css);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
root.innerHTML='<div class="nak-controls"><label for="nak-search">নক্ষত্র, তারা বা আরবি নাম খুঁজুন: <input type="search" id="nak-search" autocomplete="off" placeholder="যেমন: কৃত্তিকা, Spica, Al-Qalb"></label><label class="nak-check"><input type="checkbox" id="nak-show-abhijit" checked> অতিরিক্ত অভিজিৎ দেখান</label><span class="nak-count" id="nak-result-count" aria-live="polite"></span></div><div class="table-scroll"><table aria-label="ভারতীয় নক্ষত্র ও আরবি চন্দ্রমঞ্জিলের তুলনামূলক তালিকা"><thead><tr><th>নক্ষত্রের নাম</th><th>বিবরণ (বাংলা গ্রন্থ)</th><th>তারামণ্ডল (বাংলা / English)</th><th>মূল তারা (Bayer চিহ্নসহ)</th><th>আরবি নাম</th><th>আরবি বিবরণ (ইংরেজি গ্রন্থ)</th></tr></thead><tbody></tbody></table></div>';
const tbody=root.querySelector("tbody");
tbody.innerHTML=rows.map((r,i)=>{
 const n=i===21?"০ (বিশেষ)":String(i<21?i+1:i);
 const special=i===21;
 return '<tr'+(special?' class="nak-extra" data-abhijit="1"':'')+' data-query="'+esc(r.join(" ").toLocaleLowerCase())+'">'+
 '<td class="nak-first">'+esc(n)+'. '+esc(r[0])+(special?'<small>২৭-এর অতিরিক্ত</small>':'')+'</td>'+
 '<td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td>'+
 '<td><span class="nak-latin">'+esc(r[4])+'</span><span class="nak-arabic" lang="ar" dir="rtl">'+esc(r[5])+'</span></td>'+
 '<td>'+esc(r[6])+(special?'<div class="nak-mismatch">একই তারা নয়; কেবল ক্রমগত মিল</div>':'')+'</td></tr>';
}).join("");
const search=root.querySelector("#nak-search");
const toggle=root.querySelector("#nak-show-abhijit");
const count=root.querySelector("#nak-result-count");
function filter(){
 const q=search.value.trim().toLocaleLowerCase();
 let shown=0;
 [...tbody.rows].forEach(row=>{
   const hide=(row.dataset.abhijit==="1"&&!toggle.checked)|| (!!q&&!row.dataset.query.includes(q));
   row.hidden=hide;row.classList.toggle("hidden-row",hide);
   if(!hide)shown++;
 });
 count.textContent=shown+"টি নক্ষত্র দেখানো হচ্ছে";
}
search.addEventListener("input",filter);
toggle.addEventListener("change",filter);
filter();
})();
