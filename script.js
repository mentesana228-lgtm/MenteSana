const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = (() => {
  try {
    return localStorage.getItem('mentesana_theme');
  } catch {
    return null;
  }
})();

root.setAttribute(
  'data-theme',
  savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
);

function updateThemeLabel() {
  if (!themeToggle) return;
  const current = root.getAttribute('data-theme');
  themeToggle.innerHTML = current === 'dark' ? '☀️ Modo día' : '🌙 Modo noche';
}

updateThemeLabel();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);

    try {
      localStorage.setItem('mentesana_theme', next);
    } catch {}

    updateThemeLabel();
  });
}

const protectedPage = document.body.dataset.protegida;
try {
  if (protectedPage === 'true' && localStorage.getItem('mentesana_sesion') !== 'activa') {
    window.location.href = 'login.html';
  }
} catch {}

const logoutBtn = document.getElementById('cerrarSesion');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    try {
      localStorage.removeItem('mentesana_sesion');
    } catch {}

    window.location.href = 'login.html';
  });
}

const registrationForm = document.getElementById('registroForm');
if (registrationForm) {
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const alias = document.getElementById('alias').value.trim();
    const password = document.getElementById('password').value.trim();
    const mensaje = document.getElementById('registroMensaje');

    if (!nombre || !correo || !alias || !password) {
      mensaje.textContent = 'Completa todos los campos.';
      return;
    }

    if (password.length < 6) {
      mensaje.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    const usuario = { nombre, correo, alias, password };

    try {
      localStorage.setItem('mentesana_usuario', JSON.stringify(usuario));
      localStorage.setItem('mentesana_sesion', 'activa');
    } catch {}

    mensaje.textContent = 'Cuenta creada correctamente. Redirigiendo...';
    setTimeout(() => window.location.href = 'panel.html', 900);
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const correo = document.getElementById('loginCorreo').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const mensaje = document.getElementById('loginMensaje');

    let usuario = null;
    try {
      usuario = JSON.parse(localStorage.getItem('mentesana_usuario') || 'null');
    } catch {}

    if (!usuario) {
      mensaje.textContent = 'Primero debes crear una cuenta.';
      return;
    }

    if (correo === usuario.correo && password === usuario.password) {
      try {
        localStorage.setItem('mentesana_sesion', 'activa');
      } catch {}

      mensaje.textContent = 'Inicio de sesión correcto.';
      setTimeout(() => window.location.href = 'panel.html', 800);
    } else {
      mensaje.textContent = 'Correo o contraseña incorrectos.';
    }
  });
}

const aliasNode = document.getElementById('usuarioAlias');
if (aliasNode) {
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem('mentesana_usuario') || 'null');
  } catch {}

  aliasNode.textContent = usuario?.alias || usuario?.nombre || 'Estudiante';
}

const emergencyButton = document.getElementById('btnAyuda');
if (emergencyButton) {
  emergencyButton.addEventListener('click', () => {
    alert('Si estás en una crisis o riesgo inmediato, busca apoyo profesional, bienestar universitario o servicios de emergencia lo antes posible.');
  });
}

const questions = [
  {
    area: 'Concentración',
    titulo: 'Atención en tus actividades',
    texto: 'En los últimos días, ¿qué tan difícil ha sido concentrarte en clases, tareas o lecturas?',
    opciones: [
      ['Casi nada', 0],
      ['Un poco', 1],
      ['Bastante', 2],
      ['Muchísimo', 3]
    ]
  },
  {
    area: 'Concentración',
    titulo: 'Orden mental',
    texto: '¿Qué tanto te ha costado organizar tus ideas para empezar o continuar una tarea?',
    opciones: [
      ['Muy poco', 0],
      ['Algo', 1],
      ['Mucho', 2],
      ['Casi todo el tiempo', 3]
    ]
  },
  {
    area: 'Ansiedad',
    titulo: 'Sensación de presión',
    texto: '¿Qué tan seguido te has sentido presionado/a, inquieto/a o emocionalmente sobrepasado/a?',
    opciones: [
      ['Casi nunca', 0],
      ['A veces', 1],
      ['Muchas veces', 2],
      ['Casi siempre', 3]
    ]
  },
  {
    area: 'Ansiedad',
    titulo: 'Mente acelerada',
    texto: '¿Qué tanto has sentido pensamientos rápidos o dificultad para calmarte?',
    opciones: [
      ['Muy poco', 0],
      ['A ratos', 1],
      ['Frecuente', 2],
      ['Muy intenso', 3]
    ]
  },
  {
    area: 'Sueño',
    titulo: 'Descanso y energía',
    texto: '¿Cómo han estado tu descanso y tu energía últimamente?',
    opciones: [
      ['Bien', 0],
      ['Algo irregulares', 1],
      ['Bastante alterados', 2],
      ['Muy mal o insuficientes', 3]
    ]
  },
  {
    area: 'Sueño',
    titulo: 'Recuperación',
    texto: 'Cuando duermes, ¿sientes que realmente recuperas energía?',
    opciones: [
      ['Sí', 0],
      ['Casi siempre', 1],
      ['Pocas veces', 2],
      ['Casi nunca', 3]
    ]
  },
  {
    area: 'Motivación',
    titulo: 'Ánimo para continuar',
    texto: '¿Qué tanto te ha costado encontrar motivación para estudiar o seguir con tus pendientes?',
    opciones: [
      ['Muy poco', 0],
      ['Un poco', 1],
      ['Mucho', 2],
      ['Demasiado', 3]
    ]
  },
  {
    area: 'Motivación',
    titulo: 'Inicio de tareas',
    texto: '¿Qué tan difícil ha sido empezar incluso tareas pequeñas?',
    opciones: [
      ['Fácil', 0],
      ['Algo difícil', 1],
      ['Muy difícil', 2],
      ['Casi imposible', 3]
    ]
  },
  {
    area: 'Apoyo',
    titulo: 'Sensación de compañía',
    texto: '¿Qué tan acompañado/a te has sentido emocionalmente en este tiempo?',
    opciones: [
      ['Bien acompañado/a', 0],
      ['Algo solo/a', 1],
      ['Muy solo/a', 2],
      ['Completamente solo/a', 3]
    ]
  },
  {
    area: 'Apoyo',
    titulo: 'Necesidad de hablar con alguien',
    texto: 'Hoy, ¿qué tanto sientes que te haría bien hablar con alguien o pedir apoyo?',
    opciones: [
      ['No lo necesito', 0],
      ['Tal vez', 1],
      ['Sí, me ayudaría', 2],
      ['Lo necesito pronto', 3]
    ]
  }
];

const questionsContainer = document.getElementById('preguntasContainer');
const currentQuestionNode = document.getElementById('preguntaActual');
const totalQuestionsNode = document.getElementById('totalPreguntas');
const progressFill = document.getElementById('progresoFill');
const previousButton = document.getElementById('btnAnterior');
const nextButton = document.getElementById('btnSiguiente');
const finishButton = document.getElementById('btnFinalizar');
const questionForm = document.getElementById('formTarjetas');

let currentIndex = 0;
let answers = new Array(questions.length).fill(null);

function renderQuestion() {
  if (!questionsContainer) return;

  const q = questions[currentIndex];

  questionsContainer.innerHTML = `
    <div class="question-card">
      <p class="mini-label">Área de cuidado: ${q.area}</p>
      <h3>${q.titulo}</h3>
      <p>${q.texto}</p>
      <div class="options-grid">
        ${q.opciones.map(([texto, valor]) => `
          <button type="button" class="option-btn ${answers[currentIndex] === valor ? 'active' : ''}" data-valor="${valor}">
            <span>${texto}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  questionsContainer.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      answers[currentIndex] = Number(btn.dataset.valor);
      renderQuestion();
    });
  });

  if (currentQuestionNode) currentQuestionNode.textContent = currentIndex + 1;
  if (previousButton) previousButton.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
  if (nextButton) nextButton.classList.toggle('oculto', currentIndex === questions.length - 1);
  if (finishButton) finishButton.classList.toggle('oculto', currentIndex !== questions.length - 1);
}

function updateProgress() {
  if (progressFill) {
    progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  }
}

function showResult() {
  const areas = ['Concentración', 'Ansiedad', 'Sueño', 'Motivación', 'Apoyo'];
  const scores = { Concentración: 0, Ansiedad: 0, Sueño: 0, Motivación: 0, Apoyo: 0 };

  questions.forEach((q, i) => {
    scores[q.area] += answers[i] ?? 0;
  });

  const maxArea = 6;
  const perc = Object.fromEntries(areas.map(a => [a, Math.round((scores[a] / maxArea) * 100)]));
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const overall = Math.round((total / 30) * 100);

  const resultBox = document.getElementById('resultadoBox');
  const estado = document.getElementById('resultadoEstado');
  const mensaje = document.getElementById('resultadoMensaje');
  const recomendaciones = document.getElementById('resultadoRecomendaciones');
  const paso = document.getElementById('resultadoPaso');
  const circulo = document.getElementById('medidorCirculo');

  if (!resultBox || !estado || !mensaje || !recomendaciones || !paso || !circulo) return;

  circulo.textContent = `${overall}%`;
  circulo.className = 'meter-circle';

  if (overall <= 30) {
    circulo.classList.add('meter-low');
    estado.textContent = 'Parece que hoy tu carga emocional es baja';
    mensaje.textContent = 'Tus respuestas muestran señales manejables. Aun así, seguir cuidándote también es importante.';
  } else if (overall <= 55) {
    circulo.classList.add('meter-mid');
    estado.textContent = 'Hay señales de cansancio y sobrecarga';
    mensaje.textContent = 'Puede que estés sosteniendo varias cosas al mismo tiempo. Este es un buen momento para bajar el ritmo y darte apoyo.';
  } else if (overall <= 75) {
    circulo.classList.add('meter-high');
    estado.textContent = 'Tu bienestar necesita más atención';
    mensaje.textContent = 'Tus respuestas sugieren que varias áreas están pesando en tu día a día. Mereces apoyo y herramientas concretas para no cargar esto solo/a.';
  } else {
    circulo.classList.add('meter-urgent');
    estado.textContent = 'Hoy sería importante buscar apoyo lo antes posible';
    mensaje.textContent = 'Se observan señales intensas de malestar. No significa que estés solo/a ni sin salida; significa que pedir apoyo ahora puede hacer una gran diferencia.';
  }

  const labels = {
    Concentración: 'Concentración',
    Ansiedad: 'Ansiedad',
    Sueño: 'Sueño y descanso',
    Motivación: 'Motivación',
    Apoyo: 'Apoyo emocional'
  };

  const tips = {
    Concentración: [
      'Tu atención parece relativamente estable. Intenta mantener pausas y una sola prioridad a la vez.',
      'Tu concentración muestra desgaste. Puede ayudarte estudiar por bloques cortos y reducir distractores.',
      'Tu concentración está bastante afectada. Hoy conviene bajar exigencia, dividir tareas y pedir comprensión si lo necesitas.'
    ],
    Ansiedad: [
      'Tu nivel de tensión parece manejable. Mantén pausas breves y escucha cómo cambia tu cuerpo.',
      'Se nota presión emocional. Prueba respiración guiada, una pausa real y hablar con alguien de confianza.',
      'La ansiedad está ocupando mucho espacio. Hoy conviene detenerte, respirar, acompañarte y buscar apoyo cercano.'
    ],
    Sueño: [
      'Tu descanso parece más estable. Intenta proteger horarios y no sobrecargarte de noche.',
      'Hay señales de descanso irregular. Reducir pantallas y exigencia nocturna puede ayudarte.',
      'El sueño necesita atención importante. Descansar mejor puede cambiar mucho cómo te sientes y rindes.'
    ],
    Motivación: [
      'Tu motivación parece conservada. Mantén metas pequeñas y realistas.',
      'Se nota cansancio para continuar. Prueba empezar por una tarea mínima y reconocer ese avance.',
      'La desmotivación está pesando fuerte. No te exijas resolver todo hoy; empieza solo con un paso pequeño.'
    ],
    Apoyo: [
      'No parece haber una sensación fuerte de soledad ahora mismo. Aun así, mantener vínculos ayuda.',
      'Tal vez te está faltando más acompañamiento. Puede servir escribir a alguien de confianza hoy.',
      'Tu necesidad de apoyo es alta. Sería valioso no quedarte solo/a con esto y buscar una conversación de apoyo cuanto antes.'
    ]
  };

  const areaList = areas.map(a => {
    const p = perc[a];
    const level = p < 34 ? 0 : p < 67 ? 1 : 2;
    return { name: a, percent: p, tip: tips[a][level] };
  }).sort((a, b) => b.percent - a.percent);

  recomendaciones.innerHTML =
    '<ul>' +
    areaList.map(item => `<li><strong>${labels[item.name]}:</strong> ${item.percent}% — ${item.tip}</li>`).join('') +
    '</ul>';

  const mainArea = areaList[0];
  const secondArea = areaList[1];
  let nextStep = `Hoy tu prioridad podría ser cuidar <strong>${labels[mainArea.name]}</strong>. Empieza con una acción breve y posible en los próximos 10 minutos.`;

  if (mainArea.name === 'Ansiedad') nextStep += ' Ve a la herramienta de respiración guiada y luego escribe una sola preocupación en la descarga mental.';
  if (mainArea.name === 'Concentración') nextStep += ' Elige una única tarea pequeña, dedica 10 minutos y elimina distractores por ese rato.';
  if (mainArea.name === 'Sueño') nextStep += ' Trata de bajar exigencia esta noche, reducir pantallas y priorizar descanso real.';
  if (mainArea.name === 'Motivación') nextStep += ' No busques rendir al máximo: elige un paso mínimo y celébralo cuando lo termines.';
  if (mainArea.name === 'Apoyo') nextStep += ' Puede ayudarte preparar un mensaje y escribir hoy mismo a alguien de confianza o bienestar universitario.';

  if (mainArea.percent >= 67 || secondArea.percent >= 67) {
    nextStep += ' Si sientes que esto se mantiene, aumenta o te sobrepasa, buscar apoyo profesional o institucional sería una decisión valiosa.';
  }

  paso.innerHTML = `<p>${nextStep}</p>`;
  resultBox.classList.remove('oculto');
  resultBox.scrollIntoView({ behavior: 'smooth' });
}

if (questionsContainer && questionForm) {
  if (totalQuestionsNode) totalQuestionsNode.textContent = questions.length;

  renderQuestion();
  updateProgress();

  if (previousButton) {
    previousButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
        updateProgress();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (answers[currentIndex] === null) {
        alert('Selecciona una opción antes de continuar.');
        return;
      }

      if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
        updateProgress();
      }
    });
  }

  questionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (answers[currentIndex] === null) {
      alert('Selecciona una opción antes de finalizar.');
      return;
    }

    showResult();
  });
}

document.querySelectorAll('.reveal').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  obs.observe(el);
});

const breathVisual = document.getElementById('breathVisual');
const breathText = document.getElementById('breathText');
const startBreathing = document.getElementById('startBreathing');
const stopBreathing = document.getElementById('stopBreathing');
let breathInterval = null;

if (startBreathing && breathVisual && breathText) {
  startBreathing.addEventListener('click', () => {
    clearInterval(breathInterval);

    const phases = [
      { text: 'Inhala durante 4 segundos', expand: true, label: 'Inhala' },
      { text: 'Sostén 4 segundos', expand: true, label: 'Sostén' },
      { text: 'Exhala 6 segundos', expand: false, label: 'Exhala' }
    ];

    let i = 0;

    const run = () => {
      const p = phases[i % phases.length];
      breathText.textContent = p.text;
      breathVisual.textContent = p.label;
      breathVisual.classList.toggle('expand', p.expand);
      i++;
    };

    run();
    breathInterval = setInterval(run, 4000);
  });
}

if (stopBreathing && breathVisual && breathText) {
  stopBreathing.addEventListener('click', () => {
    clearInterval(breathInterval);
    breathVisual.textContent = 'Pausa';
    breathVisual.classList.remove('expand');
    breathText.textContent = 'Respira a tu ritmo. Cuando quieras, puedes iniciar de nuevo.';
  });
}

const processDump = document.getElementById('processDump');
if (processDump) {
  processDump.addEventListener('click', () => {
    const input = (document.getElementById('mentalDumpInput').value || '').trim();
    const out = document.getElementById('mentalDumpOutput');

    if (!input) {
      out.innerHTML = 'Escribe primero lo que te preocupa para poder organizarlo.';
      return;
    }

    const sentences = input
      .split(/[\n\.]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const urgentes = [];
    const despues = [];
    const emociones = [];

    sentences.forEach(s => {
      const t = s.toLowerCase();

      if (/ansied|crisis|no puedo|urgente|hoy|ya|examen|entrega/.test(t)) {
        urgentes.push(s);
      } else if (/triste|cans|agot|solo|bloque|miedo/.test(t)) {
        emociones.push(s);
      } else {
        despues.push(s);
      }
    });

    out.innerHTML = `
      <strong>Organización sugerida</strong>
      <div class="score-strip">
        <span class="score-pill">Urgente: ${urgentes.length}</span>
        <span class="score-pill">Emocional: ${emociones.length}</span>
        <span class="score-pill">Puede esperar: ${despues.length}</span>
      </div>
      <div style="margin-top:14px">
        <p><strong>1. Atiende primero:</strong> ${urgentes[0] || 'No se detectó algo inmediato; elige una sola tarea prioritaria.'}</p>
        <p><strong>2. Lo emocional que debes reconocer:</strong> ${emociones[0] || 'Date permiso para descansar un poco y revisar cómo te sientes.'}</p>
        <p><strong>3. Lo que puede esperar:</strong> ${despues.slice(0, 2).join(', ') || 'Reagenda lo no urgente para más tarde.'}</p>
      </div>
    `;
  });
}

const buildPlan = document.getElementById('buildPlan');
if (buildPlan) {
  buildPlan.addEventListener('click', () => {
    const selected = [...document.querySelectorAll('.checklist input:checked')].map(i => i.value);
    const out = document.getElementById('planOutput');

    if (!selected.length) {
      out.textContent = 'Selecciona al menos una acción para crear tu plan.';
      return;
    }

    out.innerHTML =
      '<strong>Plan breve para hoy</strong><ol style="margin-top:10px;padding-left:20px">' +
      selected.map(v => `<li>${v}</li>`).join('') +
      '</ol><p style="margin-top:12px">Empieza por el primer paso y evita intentar resolver todo al mismo tiempo.</p>';
  });
}

const generateHelpMessage = document.getElementById('generateHelpMessage');
if (generateHelpMessage) {
  generateHelpMessage.addEventListener('click', () => {
    const target = (document.getElementById('helpTarget').value || '').trim() || 'bienestar universitario';
    const context = (document.getElementById('helpContext').value || '').trim() || 'me siento emocionalmente sobrecargado/a y necesito orientación';
    const out = document.getElementById('helpMessageOutput');

    out.textContent =
      `Hola, quisiera pedir apoyo a ${target}. En este momento ${context}. ` +
      `Me gustaría recibir orientación sobre qué pasos seguir o con quién puedo hablar. Gracias por su atención.`;
  });
}