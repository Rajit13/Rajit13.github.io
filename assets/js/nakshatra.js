/* বাংলা জ্যোতির্বিজ্ঞান অভিধান: ভারতীয় নক্ষত্র ও আরবি lunar mansion comparison.
   Rows are aligned by historical station order, not by identical stellar membership.
   Columns: Bengali name | Bengali book (modernized) | constellation bn/en | Indian associated stars | Arabic mansion (transliteration) | Arabic script | English book (modern Bengali paraphrase).
*/
(()=>{
"use strict";
const raw=[
"অশ্বিনী||প্রাচীন গ্রন্থে ঘোড়ার মুখের মতো আকৃতিতে সাজানো তিনটি তারার সমষ্টি হিসেবে বর্ণিত।||মেষ / Aries||শেরাটান (β Arietis), মেসার্থিম (γ Arietis)||Al-Sheratau (Al-Sharatayn)||الشرطان||মেষের মাথায় অবস্থিত দুটি উজ্জ্বল তারা।",
"ভরণী||তিনটি তারা মিলে একটি ত্রিভুজাকার নক্ষত্রসমষ্টি।||মেষ / Aries||35, 39 ও 41 Arietis||Al-Botein (Al-Butayn)||البطين||‘পেট’ অর্থের আরবি নাম; মেষের উদর অঞ্চলের কয়েকটি ক্ষুদ্র তারা।",
"কৃত্তিকা||আগুনের শিখার মতো বিন্যস্ত ছয়টি তারা; বর্তমানে পরিচিত কৃত্তিকা তারাগুচ্ছ।||বৃষ / Taurus||কৃত্তিকা তারাগুচ্ছ (Pleiades, M45); অ্যালসিওনি (η Tauri)||Al-Thuraiya (Al-Thurayyā)||الثريا||প্রাচুর্যের অর্থবাহী নাম; প্লিয়াডিস বা কৃত্তিকা তারাগুচ্ছ।",
"রোহিণী||পাঁচটি তারা নিয়ে গরুর গাড়ি বা চাকার মতো একটি আকৃতি কল্পনা করা হয়েছে।||বৃষ / Taurus||রোহিণী / অ্যালডেবারান (α Tauri)||Al-Debasan (Al-Dabarān)||الدبران||হায়াডিস অঞ্চলের সঙ্গে সম্পর্কিত; বিশেষত বৃষের চোখের উজ্জ্বল অ্যালডেবারান তারা।",
"মৃগশিরা||তিনটি তারার বিন্যাসকে হরিণের মাথার সঙ্গে তুলনা করা হয়েছে।||কালপুরুষ / Orion||মেইসা (λ Orionis), φ Orionis||Al-Hekah (Al-Haqʿa)||الهقعة||কালপুরুষ বা ওরায়নের মাথার তিনটি তারা।",
"আর্দ্রা||একটি প্রধান লালচে তারার মাধ্যমে নক্ষত্রটিকে চিহ্নিত করা হয়েছে।||কালপুরুষ / Orion||আর্দ্রা / বেটেলজিউস (α Orionis)||Al-Henah (Al-Hanʿa)||الهنعة||মিথুন মণ্ডলের পায়ের কাছে দুটি তারা বলে বর্ণিত।",
"পুনর্বসু||চারটি তারার বিন্যাসে ঘর এবং তার মধ্যে ছোট একটি কুটিরের আকৃতি কল্পনা করা হয়েছে।||মিথুন / Gemini||ক্যাস্টর (α Geminorum), পোলাক্স (β Geminorum)||Al-Dira (Al-Dhirāʿ)||الذراع||মিথুনের দুই যমজের মাথার দুটি উজ্জ্বল তারা।",
"পুষ্যা||ছয়টি তারায় গঠিত, তীরের মতো আকৃতির নক্ষত্রসমষ্টি।||কর্কট / Cancer||γ, δ ও θ Cancri||Al-Nethra (Al-Nathra)||النثرة||আরবি বর্ণনায় সিংহের মুখের স্থান।",
"অশ্লেষা||পাঁচটি তারায় গঠিত; কুণ্ডলিত বা বৃত্তাকার বিন্যাসের সঙ্গে তুলনা করা হয়েছে।||হৃদসর্প / Hydra||δ, ε, η, ρ ও σ Hydrae||Al-Terpha (Al-Tarf)||الطرف||সিংহের চোখের অংশ হিসেবে বর্ণিত।",
"মঘা||পাঁচটি তারাকে কেন্দ্র করে চতুষ্কোণ খাট, সিংহাসন বা মন্দিরের প্রতীকী আকৃতি।||সিংহ / Leo||মঘা / রেগুলাস (α Leonis)||Al-Giebha (Al-Jabha)||الجبهة||সিংহের কপাল; অন্য বর্ণনায় সিংহ মণ্ডলের চারটি উজ্জ্বল তারা, যার একটি রেগুলাস।",
"পূর্বফাল্গুনী||দুটি তারায় গঠিত খাটের মতো আকৃতি।||সিংহ / Leo||জোসমা (δ Leonis), চেরটান (θ Leonis)||Al-Zubra (Al-Zubra)||الزبرة||সিংহের হৃৎপিণ্ডের পরের দুটি উজ্জ্বল তারা।",
"উত্তরফাল্গুনী||চারটি তারার সাহায্যে খাটের ওপর বিছানার মতো আকৃতি কল্পনা করা হয়েছে।||সিংহ / Leo||ডেনেবোলা (β Leonis)||Al-Serpha (Al-Sarfa)||الصرفة||সিংহের লেজের তারা।",
"হস্তা||পাঁচটি তারার সমষ্টি; মানুষের হাতের মতো বিন্যাস।||করতল / Corvus||α, β, γ, δ ও ε Corvi||Al-Auwa (Al-ʿAwwāʾ)||العواء||কন্যা মণ্ডলের নিচের দিকে পাঁচটি তারা।",
"চিত্রা||মুক্তার মতো উজ্জ্বল একটি প্রধান তারা।||কন্যা / Virgo||চিত্রা / স্পাইকা (α Virginis)||Sinak-Al-Azal (Al-Simāk al-Aʿzal)||السماك الأعزل||কন্যার হাতে ধরা শস্যশীষের উজ্জ্বল তারা স্পাইকা।",
"স্বাতী||প্রধানত একটি উজ্জ্বল তারার মাধ্যমে চিহ্নিত।||বুটিস / Boötes||স্বাতী / আর্কটুরাস (α Boötis)||Al-Gaphr (Al-Ghafr)||الغفر||কন্যা মণ্ডলের পায়ের কাছে তিনটি তারা; ভারতীয় স্বাতীর আর্কটুরাসের সঙ্গে একই তারা নয়।",
"বিশাখা||চারটি তারা নিয়ে একাধিক শাখাযুক্ত বা চতুষ্কোণ আকৃতি কল্পনা করা হয়েছে।||তুলা / Libra||জুবেনেলজেনুবি (α Librae), জুবেনেশামালি (β Librae), γ ও ι Librae||Al-Zubana (Al-Zubānā)||الزبانا||দাঁড়িপাল্লার দুটি পাল্লার অঞ্চল; ঐতিহাসিকভাবে বৃশ্চিকের চেলাও বলা হতো।",
"অনুরাধা||চারটি তারা প্রায় সরল সারিতে বিন্যস্ত বলে বর্ণিত।||বৃশ্চিক / Scorpius||আক্রাব (β Scorpii), জুব্বা (δ Scorpii), ফ্যাং (π Scorpii)||Au-Iclil (Al-Iklīl)||الإكليل||‘উত্তরের মুকুট’ বা বৃশ্চিকের মাথার মুকুটসদৃশ তারা।",
"জ্যেষ্ঠা||তিনটি তারার বিন্যাসকে কানের কুণ্ডলের সঙ্গে তুলনা করা হয়েছে।||বৃশ্চিক / Scorpius||জ্যেষ্ঠা / অ্যান্টারেস (α Scorpii), σ ও τ Scorpii||Al-Kalb (Al-Qalb)||القلب||বৃশ্চিকের হৃৎপিণ্ড, বিশেষত অ্যান্টারেস।",
"মূলা||এগারোটি তারার সমষ্টিকে একটি বিশেষ শুঁড় বা শোঁটার মতো আকৃতির সঙ্গে তুলনা করা হয়েছে।||বৃশ্চিক / Scorpius||ε, ζ, η, θ, ι, κ, λ, μ ও ν Scorpii||Al-Shaula (Al-Shawla)||الشولة||বৃশ্চিকের লেজের দুটি তারা, বিশেষত শাউলা অঞ্চল।",
"পূর্বাষাঢ়া||চারটি তারার সমষ্টি; হাতির দাঁতের মতো প্রতীকী আকৃতি।||ধনু / Sagittarius||কাউস মিডিয়া (δ Sagittarii), কাউস অস্ট্রালিস (ε Sagittarii)||Al-Naaim (Al-Naʿāʾim)||النعائم||আটটি উজ্জ্বল তারা; চারটি আকাশগঙ্গার মধ্যে, চারটি বাইরে। উটের জল আনতে যাওয়া ও ফিরে আসার উপমা ব্যবহৃত।",
"উত্তরাষাঢ়া||চারটি তারার সমষ্টি; খাট ও বিছানার মতো আকৃতি।||ধনু / Sagittarius||অ্যাসেলা (ζ Sagittarii), নানকি (σ Sagittarii)||Al-Belda (Al-Balda)||البلدة||এক মতে ধনু মণ্ডলে ছয়টি তারা, অন্য মতে আগের মঞ্জিলের পরে তুলনামূলক তারাশূন্য অঞ্চল।",
"অভিজিৎ (অতিরিক্ত)||তিনটি তারাকে নিয়ে প্রাচীন গ্রন্থে একটি প্রতীকী বিন্যাসের কথা আছে। এটি ২৭টি প্রচলিত নক্ষত্রের বাইরে অতিরিক্ত অষ্টাবিংশ নক্ষত্র।||বীণা / Lyra||অভিজিৎ / ভেগা (α Lyrae)||Al-Dabih (Saʿd al-Dhābiḥ)||سعد الذابح||মকর মণ্ডলের চারটি তারা। শুধু অবস্থানক্রমে অভিজিতের সমান্তরাল; অভিজিতের ভেগা তারার সঙ্গে এক নয়।",
"শ্রবণা||তিনটি তারার বিন্যাসে তিনটি পদচিহ্ন বা পদতলের প্রতীক কল্পনা করা হয়েছে।||ঈগল / Aquila||আলটেয়ার (α Aquilae), β ও γ Aquilae||Sad-Al-Bula (Saʿd Bulaʿ)||سعد بلع||কুম্ভ মণ্ডলের একটি বিশেষ তারা; প্রাচীন তালিকা অনুসারে বেয়ারের γ তারা বলে অনুমান করা হয়েছে।",
"ধনিষ্ঠা||পাঁচটি তারার সমষ্টি; মৃদঙ্গ বা ঢাকের মতো আকৃতি।||ডেলফিনাস / Delphinus||সুয়ালোসিন (α Delphini), β, γ ও δ Delphini||Al-Sund (Saʿd al-Suʿūd)||سعد السعود||কুম্ভ মণ্ডলের দুটি তারা; বইয়ে বেয়ারের ρ ও ξ চিহ্নের উল্লেখ আছে।",
"শতভিষা||শত তারার বৃত্তাকার সমষ্টি হিসেবে প্রতীকী বর্ণনা; ‘১০০’ এখানে প্রাচীন নকশার ধারণা, নির্দিষ্ট আধুনিক গণনা নয়।||কুম্ভ / Aquarius||সাদাখবিয়া (γ Aquarii)||Al-Achbiya (Saʿd al-Akhbiya)||سعد الأخبية||কুম্ভ মণ্ডলের চারটি তারা; বইয়ে γ, ζ, η ও θ চিহ্নের উল্লেখ আছে।",
"পূর্বভাদ্রপদ||দুটি তারায় গঠিত; খাটের ওপর বিছানার মতো আকৃতি।||পক্ষীরাজ / Pegasus||মারকাব (α Pegasi), শিয়াট (β Pegasi)||Al-Phergh—Al-Mukaddem (Al-Fargh al-Muqaddam)||الفرغ المقدم||পক্ষীরাজের দুটি উজ্জ্বল তারা, বেয়ার α ও β; একটির নাম কাঁধের তারা।",
"উত্তরভাদ্রপদ||দুটি তারার সমষ্টি; প্রাচীন গ্রন্থে একটি প্রতীকী মৎস্যাকৃতির ইঙ্গিত রয়েছে।||পক্ষীরাজ ও অ্যানড্রোমিডা / Pegasus & Andromeda||আলজেনিব (γ Pegasi), আলফেরাট্‌জ (α Andromedae)||Al-Phergh—Al-Muacher (Al-Fargh al-Muʾakhkhar)||الفرغ المؤخر||দুটি উজ্জ্বল তারা; একটি অ্যানড্রোমিডার মাথায়, অপরটি পক্ষীরাজের ডানার প্রান্তে (γ Pegasi)।",
"রেবতী||বত্রিশটি তারা মিলে মাদলের মতো বিন্যাস—এমনই ঐতিহ্যিক বর্ণনা দেওয়া হয়েছে।||মীন / Pisces||রেবতী (ζ Piscium)||Al-Risha (Al-Rishāʾ)||الرشاء||মাছ দুটির সংযোগকারী দড়ি বা বন্ধন; অন্য নাম ‘মাছের উদর’।"
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
