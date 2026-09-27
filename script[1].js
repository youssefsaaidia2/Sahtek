const form=document.getElementById("calorieForm");
const result=document.getElementById("result");

document.querySelectorAll('.goal input').forEach(r=>{
  r.addEventListener('change',()=>document.querySelectorAll('.goal').forEach(g=>g.classList.remove('active')));
});

form.addEventListener("submit",e=>{
  e.preventDefault();
  const sex=document.getElementById("sex").value;
  const age=+document.getElementById("age").value;
  const height=+document.getElementById("height").value;
  const weight=+document.getElementById("weight").value;
  const workHours=+document.getElementById("workHours").value || 0;
  const workType=document.getElementById("workType").value;
  const sport=document.getElementById("sport").value;
  const sportDays=+document.getElementById("sportDays").value || 0;
  const sportMinutes=+document.getElementById("sportMinutes").value || 0;
  const intensity=document.getElementById("intensity").value;
  const goal=document.querySelector('input[name="goal"]:checked').value;

  let bmr=10*weight+6.25*height-5*age+(sex==="male"?5:-161);

  // Baseline activity from lifestyle, work and sport.
  let factor={desk:1.25,mixed:1.40,active:1.55}[workType];
  if(workHours<4) factor-=0.03;
  if(workHours>=9) factor+=0.03;

  const sportIntensity={light:1,moderate:1.15,hard:1.3}[intensity];
  const sportMultiplier={none:0,walking:3,running:9,cycling:7,football:8,swimming:7,gym:6,other:6}[sport];
  const weeklySportBurn=(sportMultiplier*weight*(sportMinutes/60)*sportDays*0.95*sportIntensity);
  const dailySportBurn=weeklySportBurn/7;

  // Blend normal lifestyle factor with explicit sport volume.
  let tdee=bmr*factor+dailySportBurn*0.45;
  let target=tdee;
  if(goal==="lose") target=tdee-350;
  if(goal==="gain") target=tdee+250;

  const round=n=>Math.round(n/10)*10;
  document.getElementById("calories").textContent=round(target).toLocaleString("de-DE");
  document.getElementById("bmr").textContent=round(bmr).toLocaleString("de-DE")+" kcal";
  document.getElementById("tdee").textContent=round(tdee).toLocaleString("de-DE")+" kcal";
  document.getElementById("sportBurn").textContent=round(dailySportBurn).toLocaleString("de-DE")+" kcal";

  const messages={
    lose:"Für dein Ziel wurde ein moderates tägliches Defizit berücksichtigt. Beobachte deine Entwicklung und passe den Wert bei Bedarf an.",
    maintain:"Dieser Wert ist eine Schätzung deines täglichen Energiebedarfs zur Gewichtserhaltung.",
    gain:"Für dein Ziel wurde ein moderater Kalorienüberschuss berücksichtigt."
  };
  document.getElementById("message").textContent=messages[goal];
  result.classList.remove("hidden");
  result.scrollIntoView({behavior:"smooth",block:"center"});
});

document.getElementById("reset").addEventListener("click",()=>{
  form.reset();
  result.classList.add("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
});
