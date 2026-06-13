import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Grid, Chip, Card, CardContent, IconButton, Tooltip, LinearProgress } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const C = { navy:"#0F172A", purple:"#6B21A8", purpleL:"#7C3AED", green:"#166534", greenL:"#16A34A", blue:"#1E3A5F", blueL:"#1565C0", orange:"#EA580C" };

function Wrap({ children, bg="#FFFFFF" }: { children: React.ReactNode; bg?: string }) {
  return <Box sx={{ bgcolor: bg, borderRadius: 3, p: { xs: 3, md: 4 }, minHeight: "72vh", overflow: "auto" }}>{children}</Box>;
}
function NBadge({ n, bg }: { n: string; bg: string }) {
  return <Box sx={{ width:54, height:54, borderRadius:"50%", bgcolor:bg, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:22, flexShrink:0 }}>{n}</Box>;
}
function PillarHeader({ letter, title, sub, bg }: { letter:string; title:string; sub:string; bg:string }) {
  return (
    <Box sx={{ bgcolor:bg, px:2.5, py:2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={{ width:34, height:34, borderRadius:2, bgcolor:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:17 }}>{letter}</Box>
        <Box><Typography color="white" fontWeight={800} fontSize={13}>{title}</Typography><Typography color="rgba(255,255,255,0.7)" fontSize={11}>{sub}</Typography></Box>
      </Stack>
    </Box>
  );
}
function BRow({ icon, title, desc }: { icon:string; title:string; desc:string }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" mb={1.5}>
      <Typography fontSize={17} mt={0.1}>{icon}</Typography>
      <Box><Typography fontWeight={700} fontSize={13}>{title}</Typography><Typography fontSize={12} color="text.secondary" lineHeight={1.5}>{desc}</Typography></Box>
    </Stack>
  );
}

function Slide1() {
  const conditions = ["IBS","Crohn's Disease","Ulcerative Colitis","GERD","Colon Cancer","Celiac Disease","Lactose Intolerance","Diverticulitis","Appendicitis","… and more"];
  const steps = [{ icon:"🔍", t:"Search a symptom", s:"Looking for answers" },{ icon:"💻", t:"Overwhelming", s:"list of conditions" },{ icon:"😰", t:"Anxiety & confusion", s:"don't know what to believe" },{ icon:"❓", t:"Still no clarity", s:"left more confused" }];
  return (
    <Wrap>
      <Stack direction="row" spacing={2} alignItems="center" mb={4}><NBadge n="1" bg={C.navy} /><Typography variant="h3" fontWeight={900} color={C.navy}>THE PROBLEM</Typography></Stack>
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={800} color={C.navy} lineHeight={1.3}>
            You ever Google a symptom and{" "}<Box component="span" sx={{ color:C.purpleL }}>convinced that you have a dozen conditions at once.</Box>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius:2, maxWidth:360, boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p:2 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ border:"1px solid #E0E0E0", borderRadius:2, px:1.5, py:0.75, mb:2 }}>
                <Typography flex={1} color="text.secondary" fontSize={14}>gut pain causes</Typography><Typography>🔍</Typography>
              </Stack>
              <Typography variant="overline" fontSize={10} color="text.disabled" display="block" mb={1}>Search results</Typography>
              <Stack spacing={0.75}>{conditions.map(c => <Stack key={c} direction="row" spacing={1} alignItems="center"><Typography fontSize={12}>⚠️</Typography><Typography fontSize={13}>{c}</Typography></Stack>)}</Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ bgcolor:"#F3F0FF", borderRadius:3, p:3 }}>
        <Stack direction={{ xs:"column", sm:"row" }} spacing={2} alignItems="center" justifyContent="center">
          {steps.map((s, i) => (
            <React.Fragment key={s.t}>
              <Box textAlign="center" sx={{ minWidth:110 }}>
                <Typography fontSize={34} mb={0.5}>{s.icon}</Typography>
                <Typography fontWeight={700} fontSize={13} color={C.navy}>{s.t}</Typography>
                <Typography fontSize={11} color="text.secondary">{s.s}</Typography>
              </Box>
              {i < steps.length-1 && <Typography fontSize={22} color={C.purpleL} flexShrink={0}>→</Typography>}
            </React.Fragment>
          ))}
        </Stack>
      </Box>
    </Wrap>
  );
}

function Slide2() {
  const pillars = [
    { l:"M", title:"MULTI-EXPERT INTELLIGENCE", sub:"Get multiple expert opinions, not just one.", bg:C.purple, chips:["KIMI AI","SENSENOVA U1","TOKENROUTER","TERMINAL 3","DAYTONA"], chipBg:"#F3E8FF", chipColor:C.purple, steps:["You ask a question","AI consults specialist models","You receive a panel of opinions","Compare different viewpoints"], stepBg:"#FAF5FF", benefit:"Broader perspective. Deeper understanding. Better clarity." },
    { l:"E", title:"EXPERIENCE MATCHING", sub:"Find the right specialist for you.", bg:C.green, chips:["BRIGHT DATA","DAYTONA","NOSANA"], chipBg:"#F0FDF4", chipColor:C.green, steps:["Upload medical videos/reports","AI extracts key findings","Match with similar-case specialists","Connect for your 2nd opinion"], stepBg:"#F0FDF4", benefit:"Matched with experienced specialists who understand your case." },
    { l:"D", title:"DISCOVERY ECOSYSTEM", sub:"Learn from the best, curated for you.", bg:C.blueL, chips:["BRIGHT DATA","VIDEODB"], chipBg:"#EFF6FF", chipColor:C.blueL, steps:["Gather content from multiple sources","Network curates top quality content","You explore Top 10 videos & resources"], stepBg:"#EFF6FF", benefit:"Curated, trustworthy content to educate and empower you." },
  ];
  return (
    <Wrap bg="#F8FAFC">
      <Typography variant="h3" fontWeight={900} color={C.navy} textAlign="center" mb={0.5}>HOW IT WORKS — 3 PILLARS (MED)</Typography>
      <Typography color="text.secondary" textAlign="center" mb={3} fontSize={14}>Three pillars working together to turn <strong>confusion into clarity.</strong></Typography>
      <Grid container spacing={2.5}>
        {pillars.map(p => (
          <Grid item xs={12} md={4} key={p.l}>
            <Card sx={{ borderRadius:3, height:"100%", overflow:"hidden", border:`2px solid ${p.bg}` }}>
              <PillarHeader letter={p.l} title={p.title} sub={p.sub} bg={p.bg} />
              <CardContent sx={{ p:2 }}>
                <Typography variant="overline" fontSize={9} letterSpacing={2} color="text.disabled" display="block" mb={1}>HOW IT WORKS</Typography>
                <Stack spacing={0.5} mb={2}>
                  {p.steps.map((s, i) => (
                    <Stack key={s} direction="row" spacing={1} alignItems="flex-start">
                      <Box sx={{ width:18, height:18, borderRadius:"50%", bgcolor:p.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, mt:0.15 }}><Typography color="white" fontSize={9} fontWeight={800}>{i+1}</Typography></Box>
                      <Typography fontSize={11} lineHeight={1.4}>{s}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Typography variant="overline" fontSize={9} fontWeight={800} color="text.disabled" letterSpacing={2}>POWERED BY</Typography>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" mt={0.5} mb={2}>{p.chips.map(c => <Chip key={c} label={c} size="small" sx={{ fontSize:10, fontWeight:700, height:22, bgcolor:p.chipBg, color:p.chipColor, mb:0.5 }} />)}</Stack>
                <Box sx={{ bgcolor:p.stepBg, borderRadius:2, p:1.5 }}>
                  <Typography variant="overline" fontSize={9} letterSpacing={2} color={p.bg}>BENEFIT</Typography>
                  <Typography fontSize={12} mt={0.25}>{p.benefit}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ bgcolor:C.navy, borderRadius:3, p:2.5, mt:3 }}>
        <Stack direction={{ xs:"column", sm:"row" }} spacing={2} alignItems="center" justifyContent="space-around" flexWrap="wrap">
          <Typography color="rgba(255,255,255,0.6)" fontWeight={700} fontSize={12}>3 PILLARS. ONE MISSION.</Typography>
          {[{l:"M",c:"#A855F7",t:"Multiple expert viewpoints"},{op:"+"},{l:"E",c:"#22C55E",t:"Right specialists for your case"},{op:"+"},{l:"D",c:"#60A5FA",t:"Curated knowledge you trust"},{op:"="},{l:"🧑‍⚕️",c:"#FFD700",t:"INFORMED YOU"}].map((item,i) => (
            "op" in item ? <Typography key={i} color="rgba(255,255,255,0.4)" fontWeight={900} fontSize={22}>{item.op}</Typography>
            : <Box key={i} textAlign="center"><Box sx={{ width:36, height:36, borderRadius:2, bgcolor:(item.c??"")+22, display:"flex", alignItems:"center", justifyContent:"center", mx:"auto", mb:0.5 }}><Typography color={item.c} fontWeight={900} fontSize={item.l!.length>2?20:17}>{item.l}</Typography></Box><Typography color={item.c} fontWeight={700} fontSize={10}>{item.t}</Typography></Box>
          ))}
        </Stack>
      </Box>
    </Wrap>
  );
}

function Slide3() {
  const cols = [
    { l:"C", title:"CLARITY", sub:"From Confusion to Confident Understanding", bg:C.green, light:"#F0FDF4", border:"#BBF7D0",
      rows:[{ icon:"👥", title:"Multiple expert viewpoints", desc:"See how different specialists interpret your symptoms." },{ icon:"🧠", title:"AI explains the reasoning", desc:"Understand the 'why' behind each expert opinion." },{ icon:"⚖️", title:"Peer-reviewed scoring", desc:"Experts score each other for accuracy and confidence." },{ icon:"📊", title:"Compare & prioritize", desc:"See what matters most for your unique case." }],
      impact:"Cut through noise. Understand what truly matters." },
    { l:"A", title:"ACCESS", sub:"Real Specialists, Anytime, Anywhere", bg:C.purple, light:"#FAF5FF", border:"#DDD6FE",
      rows:[{ icon:"🩺", title:"Find the right specialist", desc:"Matched with doctors who've handled similar cases." },{ icon:"🎥", title:"Video second opinions", desc:"Connect with specialists conveniently from anywhere." },{ icon:"🕐", title:"24/7 availability", desc:"Get expert insights whenever you need them." },{ icon:"🔒", title:"Trusted network", desc:"Verified experts with real experience and credentials." }],
      impact:"Right expert. Right time. Better second opinions." },
    { l:"R", title:"RIGHT CHOICE", sub:"Better Decisions. Better Outcomes. Peace of Mind.", bg:C.blueL, light:"#EFF6FF", border:"#BFDBFE",
      rows:[{ icon:"✅", title:"Make informed decisions", desc:"Weigh pros, cons and alternatives with confidence." },{ icon:"💊", title:"Better treatment options", desc:"Explore the best paths tailored to your condition." },{ icon:"📈", title:"Better outcomes", desc:"Early clarity and the right care lead to better results." },{ icon:"😊", title:"Peace of mind", desc:"Feel confident you're on the right path." }],
      impact:"Better decisions today. Better health tomorrow." },
  ];
  return (
    <Wrap>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <NBadge n="4" bg={C.green} />
        <Box><Typography variant="h3" fontWeight={900} color={C.navy}>THE VALUE — 3 BENEFITS (C.A.R)</Typography><Typography color="text.secondary">MEDIQ delivers what <strong>every healthcare consumer</strong> truly needs.</Typography></Box>
      </Stack>
      <Grid container spacing={2}>
        {cols.map(col => (
          <Grid item xs={12} md={4} key={col.l}>
            <Card sx={{ borderRadius:3, height:"100%", border:`2px solid ${col.bg}` }}>
              <Box sx={{ bgcolor:col.light, px:2.5, py:2, borderBottom:`1px solid ${col.border}` }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width:36, height:36, borderRadius:2, bgcolor:col.bg, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:18 }}>{col.l}</Box>
                  <Box><Typography fontWeight={800} fontSize={16} color={col.bg}>{col.title}</Typography><Typography fontSize={12} color="text.secondary">{col.sub}</Typography></Box>
                </Stack>
              </Box>
              <CardContent sx={{ p:2.5 }}>
                {col.rows.map(r => <BRow key={r.title} {...r} />)}
                <Box sx={{ bgcolor:col.light, borderRadius:2, p:1.5, mt:1 }}>
                  <Typography variant="overline" fontSize={9} fontWeight={800} color={col.bg} letterSpacing={2}>REAL IMPACT</Typography>
                  <Typography fontSize={12} mt={0.25}>{col.impact}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ bgcolor:"#F3F0FF", borderRadius:3, p:2.5, mt:2.5 }}>
        <Stack direction={{ xs:"column", sm:"row" }} spacing={1.5} alignItems="center" flexWrap="wrap">
          <Typography fontWeight={800} color={C.navy} flexShrink={0}>C.A.R. = BETTER HEALTHCARE DECISIONS</Typography>
          {["😕 Confusion","💡 Clarity","🌐 Access","🎯 Right Choice","❤️ Better Health"].map((s, i, arr) => (
            <React.Fragment key={s}><Typography color="text.secondary" fontSize={13}>{s}</Typography>{i < arr.length-1 && <Typography color={C.purpleL} fontWeight={700}>→</Typography>}</React.Fragment>
          ))}
          <Box sx={{ bgcolor:"white", borderRadius:2, px:2, py:1, ml:1 }}>
            <Typography fontSize={13} fontWeight={800} color={C.green}>You're in control. 🛡️</Typography>
          </Box>
        </Stack>
      </Box>
    </Wrap>
  );
}

function Slide4() {
  const users = [{ icon:"🧑‍💻", title:"Healthcare Consumers", desc:"Seeking clarity for symptoms and options", c:C.blueL },{ icon:"👨‍👩‍👧", title:"Caregivers & Families", desc:"Making better decisions for loved ones", c:C.purple },{ icon:"🛡️", title:"Patients with Chronic Conditions", desc:"Need continuous insights and better outcomes", c:C.green },{ icon:"🎓", title:"Health-Conscious Individuals", desc:"Prevent, learn and stay healthier", c:C.orange }];
  const phases = [{ n:"1", t:"LAUNCH (0–3 MONTHS)", items:["Early adopters & tech-savvy users","Build product, prove value, gather feedback","Digital marketing & content-led growth"], c:"#7C3AED" },{ n:"2", t:"GROW (3–12 MONTHS)", items:["Scale via partnerships","Collaborate with clinics & specialists","Expand content & specialist network"], c:C.blueL },{ n:"3", t:"SCALE (12–24 MONTHS)", items:["Regional expansion","Integrate payer & employer channels","Advanced features & AI capabilities"], c:C.green },{ n:"4", t:"LEAD (24+ MONTHS)", items:["Become the leading AI health intelligence platform","Global partnerships & ecosystem play","Continuous innovation at scale"], c:C.orange }];
  const channels = [{ icon:"💻", t:"Digital & Content Marketing", d:"SEO, blog, social media, YouTube, TikTok" },{ icon:"🤝", t:"Strategic Partnerships", d:"Hospitals, clinics, specialists, health associations" },{ icon:"📣", t:"Community & Referral", d:"User referrals, patient communities" },{ icon:"🏢", t:"Employers & Insurers", d:"Corporate wellness, insurance partnerships" },{ icon:"🎓", t:"Educational Institutions", d:"Health programs, research, student communities" }];
  return (
    <Wrap bg="#F8FAFC">
      <Stack direction="row" spacing={2} alignItems="center" mb={3}><NBadge n="5" bg={C.green} /><Box><Typography variant="h3" fontWeight={900} color={C.navy}>GO TO MARKET STRATEGY</Typography><Typography color="text.secondary">Phased rollout. Strategic partnerships. Scalable impact.</Typography></Box></Stack>
      <Box sx={{ bgcolor:C.navy, borderRadius:2, px:3, py:2, mb:3 }}>
        <Typography color="rgba(255,255,255,0.6)" fontSize={11} fontWeight={700}>OUR MISSION</Typography>
        <Typography color="white" fontSize={14}>Empower every healthcare consumer to make informed decisions with <strong style={{ color:"#22C55E" }}>clarity</strong>, <strong style={{ color:"#A78BFA" }}>confidence</strong> and <strong style={{ color:"#60A5FA" }}>access</strong>.</Typography>
      </Box>
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={3}>
          <Typography variant="overline" fontSize={10} fontWeight={800} letterSpacing={2} display="block" mb={1.5}>① TARGET USERS</Typography>
          <Stack spacing={1}>{users.map(u => <Card key={u.title} variant="outlined" sx={{ borderRadius:2, borderLeft:`4px solid ${u.c}` }}><CardContent sx={{ p:1.5, "&:last-child":{ pb:1.5 } }}><Stack direction="row" spacing={1} alignItems="flex-start"><Typography fontSize={18}>{u.icon}</Typography><Box><Typography fontWeight={700} fontSize={12} color={u.c}>{u.title}</Typography><Typography fontSize={11} color="text.secondary">{u.desc}</Typography></Box></Stack></CardContent></Card>)}</Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography variant="overline" fontSize={10} fontWeight={800} letterSpacing={2} display="block" mb={1.5}>② GO TO MARKET PHASES</Typography>
          <Stack spacing={1.25}>{phases.map(p => <Card key={p.n} variant="outlined" sx={{ borderRadius:2, borderLeft:`4px solid ${p.c}` }}><CardContent sx={{ p:1.5, "&:last-child":{ pb:1.5 } }}><Typography fontWeight={800} fontSize={12} color={p.c} mb={0.5}>PHASE {p.n}: {p.t}</Typography>{p.items.map(it => <Typography key={it} fontSize={11} color="text.secondary">• {it}</Typography>)}</CardContent></Card>)}</Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="overline" fontSize={10} fontWeight={800} letterSpacing={2} display="block" mb={1.5}>③ KEY CHANNELS</Typography>
          <Stack spacing={1}>{channels.map(ch => <Card key={ch.t} variant="outlined" sx={{ borderRadius:2 }}><CardContent sx={{ p:1.25, "&:last-child":{ pb:1.25 } }}><Stack direction="row" spacing={1} alignItems="flex-start"><Typography fontSize={16}>{ch.icon}</Typography><Box><Typography fontWeight={700} fontSize={12}>{ch.t}</Typography><Typography fontSize={11} color="text.secondary">{ch.d}</Typography></Box></Stack></CardContent></Card>)}</Stack>
        </Grid>
      </Grid>
      <Box sx={{ bgcolor:C.navy, borderRadius:3, p:2.5, mt:3 }}>
        <Stack direction={{ xs:"column", sm:"row" }} spacing={2} alignItems="center" flexWrap="wrap">
          <Typography color="rgba(255,255,255,0.5)" fontWeight={700} fontSize={12} flexShrink={0}>THE ROAD AHEAD</Typography>
          {["🚀 Start with users. Prove value.","🤝 Build trusted partnerships.","🌍 Scale across markets.","❤️ Create lasting impact."].map((s, i, arr) => (
            <React.Fragment key={s}><Typography color="white" fontSize={12}>{s}</Typography>{i < arr.length-1 && <Typography color="rgba(255,255,255,0.3)" fontSize={16}>→</Typography>}</React.Fragment>
          ))}
        </Stack>
        <Typography color="#22C55E" fontWeight={800} fontSize={13} mt={1.5} textAlign={{ xs:"left", sm:"right" }}>MEDIQ will become the world's most trusted AI health intelligence and discovery platform.</Typography>
      </Box>
    </Wrap>
  );
}

const SLIDES = [
  { label:"The Problem", component:<Slide1 /> },
  { label:"How It Works (MED)", component:<Slide2 /> },
  { label:"The Value (C.A.R)", component:<Slide3 /> },
  { label:"Go To Market", component:<Slide4 /> },
];

export default function PitchDeck() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setSlide(s => Math.min(s+1, SLIDES.length-1));
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") setSlide(s => Math.max(s-1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="overline" color="text.disabled" fontSize={10}>MEDIQ PITCH DECK</Typography>
          <Typography fontWeight={800} fontSize={16} lineHeight={1}>{SLIDES[slide].label}</Typography>
        </Box>
        <Stack direction="row" spacing={0.75} alignItems="center">
          {SLIDES.map((s, i) => (
            <Tooltip key={i} title={s.label}>
              <Box onClick={() => setSlide(i)} sx={{ width:i===slide?28:10, height:10, borderRadius:5, cursor:"pointer", bgcolor:i===slide?"primary.main":"#E0E0E0", transition:"all 0.25s" }} />
            </Tooltip>
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small" onClick={() => setSlide(s => Math.max(s-1,0))} disabled={slide===0}><ArrowBack fontSize="small" /></IconButton>
          <Typography variant="caption" color="text.secondary">{slide+1} / {SLIDES.length}</Typography>
          <IconButton size="small" onClick={() => setSlide(s => Math.min(s+1,SLIDES.length-1))} disabled={slide===SLIDES.length-1}><ArrowForward fontSize="small" /></IconButton>
        </Stack>
      </Stack>
      <LinearProgress variant="determinate" value={((slide+1)/SLIDES.length)*100} sx={{ mb:2, height:3, borderRadius:2 }} />
      {SLIDES[slide].component}
    </Box>
  );
}
