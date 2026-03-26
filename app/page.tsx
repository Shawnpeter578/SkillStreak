"use client";

import { useState, useEffect } from 'react';
import './style.css';

// --- UTILS ---
const AudioPacks = {
  ding: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  thud: 'https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3',
  fanfare: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'
};

const SoundEngine = {
  play(type: 'ding' | 'thud' | 'fanfare') {
    if (typeof window !== 'undefined') {
      try {
        const a = new Audio(AudioPacks[type]);
        a.volume = type === 'thud' ? 0.7 : 0.4;
        a.play().catch(e => console.log('Audio playback blocked by browser', e));
      } catch (e) {
        console.error("Audio error:", e);
      }
    }
  }
};

// --- DATA ---
const UNITS: any[] = [
  {
    id: 1, name: 'Syntax & Structure',
    levels: [
      { id: 1, type: 'lesson', title: 'Welcome to Python', sub: 'The absolute basics', q: 'Python is a highly readable language. To output text to the screen, we use the print() function. Look at the example syntax below:', codeSnippet: 'print("Hello, World!")', reward: 50 },
      { id: 2, title: 'Output', sub: 'Your first line of Python', q: 'Which built-in outputs text to the terminal?', code: '<span class="cb">___</span>(<span class="cs">"Hello, World!"</span>)', opts: ['echo', 'print', 'write', 'log'], correct: 1, reward: 10 },
      { id: 3, type: 'lesson', title: 'Variables', sub: 'Binding names to values', q: 'Variables allow you to store data for later use. We use the equals sign "=" to assign a value to a name.', codeSnippet: 'score = 42\nname = "Shawn"', reward: 50 },
      { id: 4, title: 'Assigning', sub: 'Binding names', q: 'What operator assigns 42 to the variable score?', code: 'score <span class="cb">___</span> 42', opts: ['==', ':=', '=', '->'], correct: 2, reward: 15 },
      { id: 5, type: 'project', title: 'Module 1 Capstone', sub: 'Write it yourself', q: 'Create a variable called `message` and assign it the exact string `"Hello User"`.', code: 'message = ', validation: `assert 'message' in globals(), "You must define a variable named 'message'"\nassert message == "Hello User", "The message must be exactly 'Hello User'"`, solution: 'message = "Hello User"', reward: 100 },
    ]
  },
  {
    id: 2, name: 'Data Structures',
    levels: [
      { id: 6, type: 'lesson', title: 'Lists', sub: 'Ordered collections', q: 'Lists hold ordered collections of items. They are incredibly useful for grouping data. We create them using square brackets [].', codeSnippet: 'my_list = [1, 2, 3]\nempty_list = []', reward: 50 },
      { id: 7, title: 'List Syntax', sub: 'Creating a list', q: 'Which syntax creates an empty list?', code: 'items <span class="ck">=</span> <span class="cb">___</span>', opts: ['{}', '()', '[]', '<>'], correct: 2, reward: 20 },
      { id: 8, title: 'Length', sub: 'Measuring collections', q: 'Which function returns the number of items in a list?', code: 'count <span class="ck">=</span> <span class="cb">___</span>(items)', opts: ['size', 'count', 'length', 'len'], correct: 3, reward: 30 },
      { id: 9, type: 'project', title: 'Module 2 Capstone', sub: 'List Mastery', q: 'Create a list called `primes` containing exactly the numbers 2, 3, and 5. Then use the `.append()` method to add 7 to it.', code: '# Step 1: Create primes list\n\n# Step 2: Append 7\n', validation: `assert 'primes' in globals(), "You must define a variable 'primes'"\nassert type(primes) is list, "primes must be a list"\nassert primes == [2, 3, 5, 7], "primes must equal [2, 3, 5, 7] at the end"`, solution: 'primes = [2, 3, 5]\nprimes.append(7)', reward: 100 },
    ]
  },
  {
    id: 3, name: 'String Mastery',
    levels: [
      { id: 10, type: 'lesson', title: 'String Methods', sub: 'Manipulating text', q: 'Python strings come with powerful built-in methods. For instance, `.upper()` converts a string to uppercase.', codeSnippet: 'word = "hello"\nshout = word.upper() # "HELLO"', reward: 50 },
      { id: 11, title: 'Upper', sub: 'Changing case', q: 'What converts a string to all uppercase?', code: 'result <span class="ck">=</span> name.<span class="cb">___</span>()', opts: ['capitalize', 'upper', 'toUpper', 'toUpperCase'], correct: 1, reward: 20 },
      { id: 12, title: 'Strip', sub: 'Removing whitespace', q: 'Which removes leading and trailing whitespace?', code: 'clean <span class="ck">=</span> text.<span class="cb">___</span>()', opts: ['clean', 'trim', 'remove', 'strip'], correct: 3, reward: 25 },
      { id: 13, type: 'project', title: 'Module 3 Capstone', sub: 'Shouting Box', q: 'Create a variable `name` = "shawn". Then create a variable `shout` that equals `name` fully uppercased.', code: '# Write your code below\n', validation: `assert 'name' in globals(), "You must define 'name'"\nassert 'shout' in globals(), "You must define 'shout'"\nassert shout == "SHAWN", "shout must be 'SHAWN'"`, solution: 'name = "shawn"\nshout = name.upper()', reward: 100 },
    ]
  }
];

const ALL = UNITS.flatMap(u => u.levels.map(l => ({ ...l, unit: u })))
const TOTAL = ALL.length;

const BOTS = [{ name: 'Aiko', xp: 38000, av: 'bot1' }, { name: 'Renz', xp: 25000, av: 'bot2' }, { name: 'Nova', xp: 14000, av: 'bot3' }, { name: 'Zuko', xp: 8000, av: 'bot4' }];

const OB = [
  { g: '⌘', h: 'kill<em>Streak</em>', p: 'The most refined way to master Python. One question at a time.' },
  { g: '⌥', h: 'Guard Your <em>Hearts</em>', p: 'Every wrong answer breaks your streak and costs 1 Heart. Stay sharp.' },
  { g: '◈', h: 'Climb the <em>Rankings</em>', p: 'Earn gems and XP for every correct answer. Reach the top.' },
];

export default function Page() {
  const [S, setS] = useState<any>({
    streak: 0, gems: 100,
    xp: 0, qi: 0,
    best: 0, sel: null,
    hearts: 5, lastHeartLoss: null,
    projTries: 3
  });
  
  const [onboarded, setOnboarded] = useState(false);
  const [obStep, setObStep] = useState(0);
  const [view, setView] = useState('learn'); // learn | rank | play
  const [challenge, setChallenge] = useState<any>(null);
  const [codeVal, setCodeVal] = useState<string>(''); 
  const [feedback, setFeedback] = useState<any>(null);
  const [done, setDone] = useState(false);
  const [pyReady, setPyReady] = useState(false);

  // New states for formatting & sandbox
  const [playCodeVal, setPlayCodeVal] = useState<string>('print("Welcome to Sandbox!\\nWrite Python code here.")');
  const [playOut, setPlayOut] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [floaters, setFloaters] = useState<any[]>([]);

  useEffect(() => {
    if (localStorage.getItem('ks_ob') === '1') {
      setOnboarded(true);
      boot();
    }

    // Load Pyodide
    if (typeof window !== 'undefined') {
      const initPy = async () => {
        try {
          (window as any).pyodideInstance = await (window as any).loadPyodide({
            stdout: (text: string) => {
              window.dispatchEvent(new CustomEvent('pyout', { detail: text + '\n' }));
            }
          });
          setPyReady(true);
        } catch (e) {
          console.error("Pyodide Load Failed", e);
        }
      };

      if (!(window as any).loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
        script.onload = initPy;
        document.head.appendChild(script);
      } else if (!(window as any).pyodideInstance) {
        initPy();
      } else {
        setPyReady(true);
      }
    }
  }, []);

  // Sandbox Stdout listener
  useEffect(() => {
    const handler = (e: any) => {
      setPlayOut(prev => prev + e.detail);
    };
    window.addEventListener('pyout', handler);
    return () => window.removeEventListener('pyout', handler);
  }, []);

  // Heart Regeneration Logic
  useEffect(() => {
    const iv = setInterval(() => {
      if (S.hearts < 5 && S.lastHeartLoss) {
        const diffHrs = (Date.now() - S.lastHeartLoss) / 3600000;
        if (diffHrs >= 1) {
          const gained = Math.floor(diffHrs);
          const newH = Math.min(5, S.hearts + gained);
          const newS = { ...S, hearts: newH, lastHeartLoss: newH === 5 ? null : S.lastHeartLoss + (gained * 3600000) };
          setS(newS); save(newS);
        }
      }
    }, 10000);
    return () => clearInterval(iv);
  }, [S]);

  const boot = () => {
    const savedState = {
      streak: +localStorage.getItem('ks_s')! || 0,
      gems: +localStorage.getItem('ks_g')! || 100,
      xp: +localStorage.getItem('ks_x')! || 0,
      qi: +localStorage.getItem('ks_q')! || 0,
      best: +localStorage.getItem('ks_b')! || 0,
      hearts: localStorage.getItem('ks_h') ? +localStorage.getItem('ks_h')! : 5,
      lastHeartLoss: localStorage.getItem('ks_lhl') ? +localStorage.getItem('ks_lhl')! : null,
      projTries: 3,
      sel: null
    };
    setS(savedState);
    if (savedState.qi >= TOTAL) {
      setDone(true);
    }
  };

  const save = (newState: any) => {
    localStorage.setItem('ks_s', newState.streak);
    localStorage.setItem('ks_g', newState.gems);
    localStorage.setItem('ks_x', newState.xp);
    localStorage.setItem('ks_q', newState.qi);
    localStorage.setItem('ks_b', newState.best);
    localStorage.setItem('ks_h', newState.hearts);
    if (newState.lastHeartLoss) localStorage.setItem('ks_lhl', newState.lastHeartLoss);
    else localStorage.removeItem('ks_lhl');
  };

  const handleObNext = () => {
    const nextStep = obStep + 1;
    if (nextStep >= OB.length) {
      localStorage.setItem('ks_ob', '1');
      setOnboarded(true);
      boot();
    } else {
      setObStep(nextStep);
    }
  };

  const openChallenge = (lv: any) => {
    if (lv.type !== 'lesson' && S.hearts === 0) {
      setFeedback({
        type: 'err', em: 'Out of Hearts.',
        body: `You have 0 Hearts remaining. Wait for regeneration or refill instantly.`,
        act: 'Refill Hearts (50 Gems)',
        isRefill: true
      });
      return;
    }
    setChallenge(lv);
    setS((prev: any) => ({ ...prev, sel: null, projTries: 3 }));
    if (lv.type === 'interactive' || lv.type === 'project') setCodeVal(lv.code || '');
  };

  const spawnFloater = (e: React.MouseEvent, text: string) => {
    if (!e) return;
    const id = Date.now() + Math.random();
    // Shift slightly randomly
    const dx = (Math.random() - 0.5) * 40;
    setFloaters(prev => [...prev, { id, text, x: e.clientX + dx - 20, y: e.clientY - 40 }]);
    setTimeout(() => {
      setFloaters(prev => prev.filter(f => f.id !== id));
    }, 1000);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400); 
  };

  const onCheck = (e?: React.MouseEvent) => {
    const lv = ALL[S.qi];
    if (!lv) return;

    if (lv.type === 'lesson') {
        SoundEngine.play('ding');
        const rwd = lv.reward || 50;
        if (e) spawnFloater(e, `+${rwd} XP`);
        const newState = { ...S, xp: S.xp + rwd, qi: S.qi + 1 };
        setS(newState); save(newState);
        setFeedback({ type: 'ok', em: 'Lesson Complete.', body: `+${rwd} XP earned.`, act: newState.qi >= TOTAL ? 'Finish Course →' : 'Continue →' });
        setChallenge(null);
        return;
    }

    if (lv.type === 'project') {
        if (!codeVal.trim()) return;
        let isCorrect = false;
        let errMsg = '';
        try {
            (window as any).pyodideInstance.runPython(codeVal + '\n' + lv.validation);
            isCorrect = true;
        } catch (err: any) {
            isCorrect = false;
            errMsg = err.message.split('\n').pop() || 'Execution failed';
        }

        if (isCorrect) {
            SoundEngine.play(S.qi >= TOTAL - 1 ? 'fanfare' : 'ding');
            if (e) spawnFloater(e, `+${lv.reward} Gems`);
            const newState = { ...S, gems: S.gems + lv.reward, xp: S.xp + lv.reward * 10, streak: S.streak + 1, best: Math.max(S.best, S.streak + 1), qi: S.qi + 1 };
            setS(newState); save(newState);
            setFeedback({ type: 'ok', em: 'Project Passed!', body: `Amazing! +${lv.reward} gems earned.`, act: newState.qi >= TOTAL ? 'Finish Course →' : 'Continue →' });
        } else {
            SoundEngine.play('thud');
            triggerShake();
            const newTries = Math.max(0, S.projTries - 1);
            const newState = { ...S, projTries: newTries };
            setS(newState); save(newState);

            if (newTries > 0) {
                setFeedback({ type: 'err', em: 'Test Failed.', body: `Error: ${errMsg}. You have ${newTries} tries left for this project.`, act: 'Try Again' });
            } else {
                setFeedback({ type: 'err', em: 'Project Failed.', body: `Error: ${errMsg}. You are out of tries. Study the solution to continue.`, act: 'Show Solution', isShowSolution: true });
            }
        }
        setChallenge(null);
        return;
    }

    let isCorrect = false;

    if (lv.type === 'interactive') {
      if (!codeVal.trim()) return;
      try {
        (window as any).pyodideInstance.runPython(codeVal + '\n' + lv.validation);
        isCorrect = true;
      } catch (err: any) {
        isCorrect = false;
      }
    } else {
      if (S.sel === null) return;
      isCorrect = (S.sel === lv.correct);
    }

    if (isCorrect) {
      SoundEngine.play(S.qi >= TOTAL - 1 ? 'fanfare' : 'ding');
      if (e) spawnFloater(e, `+${lv.reward} Gems`);
      const newState = {
        ...S,
        gems: S.gems + lv.reward,
        xp: S.xp + lv.reward * 10,
        streak: S.streak + 1,
        best: Math.max(S.best, S.streak + 1),
        qi: S.qi + 1
      };
      setS(newState);
      save(newState);

      setFeedback({
        type: 'ok',
        em: 'Correct.',
        body: `+${lv.reward} gems earned. Streak: ${newState.streak}`,
        act: newState.qi >= TOTAL ? 'View Results →' : 'Next Level →'
      });
    } else {
      SoundEngine.play('thud');
      triggerShake();
      const newH = Math.max(0, S.hearts - 1);
      const newState = {
        ...S,
        hearts: newH,
        streak: 0,
        lastHeartLoss: newH < 5 && S.hearts === 5 ? Date.now() : S.lastHeartLoss
      };
      setS(newState);
      save(newState);

      let hintTxt = 'Study the code and try again.';
      if (newH === 0) hintTxt += ' (Out of hearts!)';

      setFeedback({
        type: 'err',
        em: 'Wrong.',
        body: `Streak lost. −1 Heart. ${hintTxt}`,
        act: newH === 0 ? 'Refill Hearts (50 Gems)' : 'Try Again',
        isRefill: newH === 0
      });
    }
    setChallenge(null);
    setCodeVal('');
  };

  const handleFeedbackAck = () => {
    if (feedback.isRefill) {
      if (S.gems >= 50) {
        const ns = { ...S, gems: S.gems - 50, hearts: 5, lastHeartLoss: null };
        setS(ns); save(ns);
        setFeedback(null);
        SoundEngine.play('ding');
      } else {
        alert("Not enough gems to refill hearts!");
        setFeedback(null);
      }
      return;
    }

    if (feedback.isShowSolution) {
      const lv = ALL[S.qi];
      setCodeVal(lv.solution);
      setS((prev: any) => ({...prev, projTries: 3}));
      setFeedback(null);
      setChallenge(lv);
      return;
    }

    if (feedback.type === 'ok' && S.qi >= TOTAL) {
      setDone(true);
    }
    setFeedback(null);
  };

  const handleRestart = () => {
    const newState = {
      streak: 0, gems: 100, xp: 0, qi: 0, best: 0, sel: null, hearts: 5, lastHeartLoss: null, projTries: 3
    };
    setS(newState);
    save(newState);
    setDone(false);
  };

  if (!onboarded) {
    const o = OB[obStep];
    return (
      <div className="ob">
        <div className="ob-body">
          <div className="ob-glyph" dangerouslySetInnerHTML={{ __html: o.g }}></div>
          <div className="ob-h" dangerouslySetInnerHTML={{ __html: o.h }}></div>
          <div className="ob-p">{o.p}</div>
        </div>
        <div className="ob-foot">
          <div className="ob-dots">
            {OB.map((_, i) => <div key={i} className={`ob-dot ${i === obStep ? 'on' : ''}`}></div>)}
          </div>
          <button className="ob-btn" onClick={handleObNext}>
            {obStep === OB.length - 1 ? 'Start Learning →' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="done-screen on">
        <div className="done-glyph">✦</div>
        <div className="done-h">All Modules Complete.</div>
        <div className="done-sub">You've finished all 3 Python modules. More content arriving soon.</div>
        <div className="done-stats">
          <div className="done-stat"><div className="done-val">{S.gems}</div><div className="done-lbl">Gems</div></div>
          <div className="done-stat"><div className="done-val">{S.best}</div><div className="done-lbl">Best</div></div>
          <div className="done-stat"><div className="done-val">{S.xp}</div><div className="done-lbl">XP</div></div>
        </div>
        <button className="done-restart" onClick={handleRestart}>Restart Journey</button>
      </div>
    );
  }

  const pct = Math.round((S.qi / TOTAL) * 100);

  return (
    <>
      {floaters.map(f => (
        <div key={f.id} className="floater" style={{ left: f.x, top: f.y }}>{f.text}</div>
      ))}
      <div className={`shell on ${isShaking ? 'shake' : ''}`}>
        <header className="topbar">
          <div className="wordmark">Skill<em>Streak</em></div>
          <div className="chips">
            <div className="chip"><div className="cdot" style={{ background: '#e11d48' }}></div><span>{S.hearts}/5</span></div>
            <div className="chip"><div className="cdot f"></div><span>{S.streak}</span></div>
            <div className="chip"><div className="cdot g"></div><span>{S.gems}</span></div>
          </div>
        </header>

        <div className="main">
          {view === 'learn' && (
            <div className="view on">
              <div className="path-view">
                <div className="unit-hd">
                  <div className="unit-label">Python · Curriculum</div>
                  <div className="unit-name">Syntax &amp; <em>Structure</em></div>
                  <div className="prog-row">
                    <div className="prog-track"><div className="prog-bar" style={{ width: `${pct}%` }}></div></div>
                    <div className="prog-num">{S.qi}/{TOTAL}</div>
                  </div>
                </div>
                <div className="levels">
                  {UNITS.map((unit, uIdx) => (
                    <div key={unit.id}>
                      <div className="unit-sep" key={unit.id}>
                        <span className="sep-label">Module {unit.id}</span><span className="sep-name">{unit.name}</span><div className="sep-line"></div>
                      </div>
                      {unit.levels.map((lv: any, i: number) => {
                        const gi = ALL.findIndex(l => l.id === lv.id);
                        const state = gi < S.qi ? 'done' : gi === S.qi ? 'active' : 'locked';
                        
                        let tag = state === 'done' ? 'complete' : state === 'active' ? 'current' : 'locked';
                        if (lv.type === 'lesson' && state !== 'done') tag = 'lesson';
                        if (lv.type === 'project' && state !== 'done') tag = 'project';

                        return (
                          <div className={`level-item ${state}`} key={lv.id}>
                            <div className="spine">
                              <div className="s-dot" style={lv.type === 'project' ? {borderRadius: '4px'} : {}}></div><div className="s-line"></div>
                            </div>
                            <div className={`lv-card ${state === 'active' ? 'tap' : ''}`} onClick={() => state === 'active' && openChallenge(lv)}>
                              <div className="lv-top">
                                <div className="lv-num">Step {i + 1}</div>
                                <div className="lv-tag" style={lv.type === 'project' && state === 'active' ? { background: '#f43f5e' } : lv.type === 'lesson' && state === 'active' ? {background: '#3f1d38'} : {}}>{tag}</div>
                              </div>
                              <div className="lv-title">{lv.title}</div>
                              <div className="lv-sub">{lv.sub}</div>
                              {state !== 'locked' && (
                                <div className="lv-footer">
                                  {lv.type !== 'lesson' && <div className="lv-gems"><div className="lv-gd"></div>{lv.reward} gems</div>}
                                  {lv.type === 'lesson' && <div className="lv-gems">+50 XP</div>}
                                  {state === 'active' && <div className="lv-arrow">→</div>}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'rank' && (
            <div className="view on">
              <Leaderboard xp={S.xp} />
            </div>
          )}

          {view === 'play' && (
            <div className="view play-view on">
              <div className="play-title">Playground 💻</div>
              <textarea
                className="play-code"
                value={playCodeVal}
                onChange={(e) => setPlayCodeVal(e.target.value)}
                spellCheck={false}
                placeholder="# Write any Python code here"
              />
              <div className="play-run" onClick={() => {
                if (!pyReady) return;
                setPlayOut(''); // clear output
                try {
                  (window as any).pyodideInstance.runPython(playCodeVal);
                } catch (err: any) {
                  setPlayOut(prev => prev + '\n' + err.message);
                }
              }}>
                {pyReady ? 'Run Code ▶' : 'Loading Python...'}
              </div>
              <div className="play-out">
                {playOut || 'Ready for output... (Prints will appear here)'}
              </div>
            </div>
          )}
        </div>

        <nav className="botnav">
          <button className={`nav-btn ${view === 'learn' ? 'on' : ''}`} onClick={() => setView('learn')}>
            <div className="nav-ic">⊞</div><span>Learn</span>
          </button>
          <button className={`nav-btn ${view === 'play' ? 'on' : ''}`} onClick={() => setView('play')}>
            <div className="nav-ic">💻</div><span>Sandbox</span>
          </button>
          <button className={`nav-btn ${view === 'rank' ? 'on' : ''}`} onClick={() => setView('rank')}>
            <div className="nav-ic">◈</div><span>Rank</span>
          </button>
        </nav>

        {challenge && (
          <div className="overlay on">
            <div className="sheet">
              <div className="sh-handle"><div className="sh-bar"></div></div>
              <div className="sh-hd">
                <div className="sh-fname">step_{challenge.id}.py</div>
                {challenge.type !== 'lesson' && <div className="sh-reward">+{challenge.reward} gems</div>}
                <button className="sh-close" onClick={() => setChallenge(null)}>✕</button>
              </div>
              <div className="sh-body">

                {challenge.type === 'lesson' ? (
                  <>
                    <div><div className="brief-lbl">Lesson</div><div className="brief-q">{challenge.q}</div></div>
                    <div className="code-wrap">
                      <div className="code-bar"><div className="d r"></div><div className="d y"></div><div className="d g"></div><div className="code-tag">example</div></div>
                      <div className="code-inner">{challenge.codeSnippet}</div>
                    </div>
                  </>
                ) : challenge.type === 'project' ? (
                  <>
                    <div><div className="brief-lbl">Capstone Project • {S.projTries} Tries Left</div><div className="brief-q">{challenge.q}</div></div>
                    <div className="code-wrap" style={{ background: 'transparent', padding: 0 }}>
                      <textarea
                        className="interactive-terminal"
                        value={codeVal}
                        onChange={(e) => setCodeVal(e.target.value)}
                        spellCheck={false}
                        placeholder="# Write your project code here"
                      />
                    </div>
                    {!pyReady && <div style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>Loading Python Runtime...</div>}
                  </>
                ) : challenge.type === 'interactive' ? (
                  <>
                    <div><div className="brief-lbl">Mission</div><div className="brief-q">{challenge.q}</div></div>
                    <div className="code-wrap" style={{ background: 'transparent', padding: 0 }}>
                      <textarea
                        className="interactive-terminal"
                        value={codeVal}
                        onChange={(e) => setCodeVal(e.target.value)}
                        spellCheck={false}
                        placeholder="# Write Python code here"
                      />
                    </div>
                    {!pyReady && <div style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>Loading Python Runtime...</div>}
                  </>
                ) : (
                  <>
                    <div><div className="brief-lbl">Mission</div><div className="brief-q">{challenge.q}</div></div>
                    <div className="code-wrap">
                      <div className="code-bar"><div className="d r"></div><div className="d y"></div><div className="d g"></div><div className="code-tag">python</div></div>
                      <div className="code-inner" dangerouslySetInnerHTML={{ __html: challenge.code }}></div>
                    </div>
                    <div>
                      <div className="opts-lbl">Pick the correct answer</div>
                      <div className="opts-grid">
                        {challenge.opts.map((o: string, i: number) => (
                          <button key={i} className={`opt ${S.sel === i ? 'on' : ''}`} onClick={() => setS((prev: any) => ({ ...prev, sel: i }))}>
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="sh-ft">
                {challenge.type === 'lesson' ? (
                  <button className="check-btn" onClick={(e) => onCheck(e)}>Complete Lesson</button>
                ) : (
                  <button className="check-btn"
                    disabled={(challenge.type === 'interactive' || challenge.type === 'project') ? (!codeVal.trim() || !pyReady) : S.sel === null}
                    onClick={(e) => onCheck(e)}>
                    {(challenge.type === 'interactive' || challenge.type === 'project') && !pyReady ? 'Downloading Python...' : challenge.type === 'project' ? 'Submit Project' : 'Check Answer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {feedback && (
          <div className="fb-ov on">
            <div className={`fb-sheet ${feedback.type}`}>
              <div className="fb-em">{feedback.em}</div>
              <div className="fb-body">{feedback.body}</div>
              <button className="fb-act" onClick={handleFeedbackAck}>{feedback.act}</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const Leaderboard = ({ xp }: { xp: number }) => {
  const me = { name: 'You', xp, av: 'Alpha', me: true };
  const all = [...BOTS, me].sort((a, b) => b.xp - a.xp);
  const rank = all.findIndex(u => u.me) + 1;
  const rc = ['g', 's', 'b'];

  return (
    <div className="lb-view">
      <div className="lb-title">Rankings</div>
      <div className="lb-sub">Weekly · Global</div>
      <div className="lb-you">
        <div className="lb-you-rank">#{rank}</div>
        <img className="lb-av" src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=You" alt="" />
        <div className="lb-you-name">You</div>
        <div className="lb-you-xp">{xp.toLocaleString()} XP</div>
      </div>
      <div className="lb-rows">
        {all.map((u, i) => (
          <div className="lb-row" key={u.name}>
            <div className={`lb-rrank ${rc[i] || ''}`}>{['①', '②', '③'][i] || `#${i + 1}`}</div>
            <img className="lb-av" src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${u.av || u.name}`} alt="" />
            <div className="lb-rname">{u.name}</div>
            <div className="lb-rxp">{u.xp.toLocaleString()} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
};