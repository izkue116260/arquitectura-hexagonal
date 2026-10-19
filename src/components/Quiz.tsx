import { useState } from 'react';

interface Option {
  text: string;
  why?: string;
}

interface Question {
  question: string;
  code?: string;
  options: Option[];
  answer: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    question: '¿Cuál es la idea principal de la arquitectura hexagonal?',
    options: [
      {
        text: 'Separar el código según el tipo de archivo que sea.',
        why: 'Eso es ordenar los archivos por su tipo (componentes, utilidades...). Es una forma de organizar carpetas, pero no dice nada de qué parte depende de cuál.',
      },
      {
        text: 'Repartir el código en carpetas, una por cada pantalla.',
        why: 'Organizar por pantallas es otra forma de ordenar carpetas. La arquitectura hexagonal no trata de dónde se colocan los archivos, sino de cómo se relacionan las partes.',
      },
      { text: 'Que los detalles externos dependan de las reglas, y no al revés.' },
      {
        text: 'Reutilizar comportamiento entre módulos mediante herencia.',
        why: 'La herencia es una técnica para compartir código entre clases. La arquitectura hexagonal no la necesita: se centra en separar las reglas de lo externo.',
      },
    ],
    answer: 2,
    explanation:
      'Las reglas de negocio son lo importante y no deben depender de detalles externos (la interfaz, el guardado de datos, un servidor). Son esos detalles los que se adaptan a las reglas, así se pueden cambiar sin tocarlas.',
  },
  {
    question: '¿Qué contiene el dominio?',
    options: [
      { text: 'Las reglas del negocio, sin depender de nada de fuera.' },
      {
        text: 'Las pantallas y todo lo que ve el usuario.',
        why: 'Lo que ve el usuario es la interfaz, y es algo externo que puede cambiar. El dominio no debería saber nada de cómo se muestra.',
      },
      {
        text: 'El código que habla con el servidor o la base de datos.',
        why: 'Hablar con un servidor o una base de datos es un detalle técnico y externo. Ese código se queda en los bordes, no en el centro.',
      },
      {
        text: 'La configuración de la aplicación y sus dependencias.',
        why: 'La configuración es un asunto técnico de la aplicación, no una regla del negocio. No es algo que el negocio exija que se cumpla.',
      },
    ],
    answer: 0,
    explanation:
      'El dominio es el corazón de la aplicación: las reglas que serían ciertas aunque no existiera ninguna pantalla ni ninguna base de datos.',
  },
  {
    question: '¿Qué problema tiene este código?',
    code: `// dominio/pedido.ts
import { enviarCorreo } from '../adaptadores/correo';

export function confirmarPedido(pedido: Pedido) {
  if (pedido.lineas.length === 0) throw new Error('Pedido vacío');
  enviarCorreo(pedido.cliente);
}`,
    options: [
      {
        text: 'Falta devolver un valor cuando la función termina correctamente.',
        why: 'Una función que no devuelve nada es perfectamente válida, por ejemplo si solo comprueba y actúa. Ese no es el problema aquí.',
      },
      {
        text: 'La comprobación del pedido vacío no debería estar en el dominio.',
        why: 'Al contrario: "un pedido no puede estar vacío" es una regla del negocio, y las reglas del negocio son justo lo que vive en el dominio.',
      },
      {
        text: 'Lanzar un error dentro del dominio no está permitido en esta arquitectura.',
        why: 'Sí está permitido. El dominio puede rechazar situaciones inválidas lanzando un error; es una forma habitual de proteger sus reglas.',
      },
      { text: 'El dominio depende de algo externo, y debería ser al revés.' },
    ],
    answer: 3,
    explanation:
      'El dominio importa algo de la zona de adaptadores. Las flechas apuntan siempre hacia dentro: el dominio no puede conocer lo que hay fuera. El envío del correo debería hacerse a través de un contrato.',
  },
  {
    question: '¿Qué es un puerto?',
    options: [
      {
        text: 'Una función que obtiene los datos ya preparados para mostrarlos.',
        why: 'Una función con código hace un trabajo, y eso es justo lo que un puerto no hace: no ejecuta nada, solo describe algo.',
      },
      { text: 'Un contrato que dice qué hace falta, sin decir cómo se hace.' },
      {
        text: 'El archivo principal desde el que arranca la aplicación.',
        why: 'El archivo de arranque es el punto donde empieza a ejecutarse la aplicación. No tiene relación con lo que es un puerto.',
      },
      {
        text: 'La carpeta que agrupa todo el código que habla con el exterior.',
        why: 'Un puerto no es una carpeta ni contiene código que haga el trabajo. Es una pieza mucho más pequeña.',
      },
    ],
    answer: 1,
    explanation:
      'Es el "enchufe": describe lo que la aplicación necesita del exterior. Cualquier cosa que cumpla ese contrato puede conectarse.',
  },
  {
    question: '¿Qué es un adaptador?',
    options: [
      {
        text: 'Una regla de negocio que se comparte entre varios casos de uso.',
        why: 'Las reglas de negocio viven en el dominio y no tienen que ver con tecnologías externas. El adaptador está justo en el otro extremo.',
      },
      {
        text: 'La descripción de lo que el caso de uso necesita del exterior.',
        why: 'Eso es una descripción de lo que hace falta, no algo que haga el trabajo. Esa pieza ya la hemos visto con otro nombre.',
      },
      { text: 'Código que cumple un contrato usando algo externo concreto.' },
      {
        text: 'Un caso de uso especial que no necesita aplicar ninguna regla.',
        why: 'No existe un caso de uso "sin reglas". Y un adaptador no es un caso de uso: está en otra zona distinta.',
      },
    ],
    answer: 2,
    explanation:
      'Es el "aparato" que se enchufa al puerto. Puede haber varios adaptadores para el mismo puerto, cada uno con una tecnología distinta.',
  },
  {
    question: '¿Qué hará TypeScript con este código?',
    code: `interface PedidoRepository {
  buscar(id: string): Promise<Pedido>;
  guardar(pedido: Pedido): Promise<void>;
}

const pedidoEnMemoria: PedidoRepository = {
  async buscar(id) {
    /* ... */
  },
};`,
    options: [
      {
        text: 'Funcionará, porque solo se usa lo que hace falta en cada momento.',
        why: 'TypeScript exige cumplir el contrato entero, aunque ahora mismo no se use todo. Si no, el día que alguien llame a lo que falta, fallaría.',
      },
      {
        text: 'Funcionará, pero mostrará una advertencia cuando se ejecute.',
        why: 'TypeScript no avisa al ejecutar: sus comprobaciones ocurren antes, al escribir o compilar el código, y son errores, no advertencias.',
      },
      {
        text: 'Dará un error, porque tiene que ser una clase y no un objeto.',
        why: 'Un objeto normal puede cumplir un contrato sin problema. Si hay un error, no viene de usar un objeto en lugar de una clase.',
      },
      { text: 'Dará un error, porque falta una función que exige el contrato.' },
    ],
    answer: 3,
    explanation:
      'Un adaptador tiene que cumplir el contrato entero. Aquí falta guardar, y TypeScript avisa antes de ejecutar nada. Esa es la garantía de que el enchufe encaja.',
  },
  {
    question: 'Cambia la forma de guardar los datos de la aplicación. ¿Qué haces como mínimo?',
    options: [
      {
        text: 'Modificar el caso de uso para que hable con la nueva tecnología.',
        why: 'Si el caso de uso hablara directamente con la tecnología, habríamos perdido la ventaja de esta arquitectura. Su trabajo es hablar solo con el contrato.',
      },
      { text: 'Crear un adaptador nuevo y usarlo en lugar del anterior.' },
      {
        text: 'Reescribir las reglas del dominio para que se adapten a ella.',
        why: 'Las reglas no cambian porque cambie la tecnología. Que los datos se guarden en un sitio u otro no afecta a lo que el negocio exige.',
      },
      {
        text: 'Cambiar el contrato y todos los adaptadores que ya existen.',
        why: 'Si el contrato está bien pensado (dice qué hace falta, no cómo), no depende de la tecnología. Cambiarlo obligaría a tocar todo, justo lo que queremos evitar.',
      },
    ],
    answer: 1,
    explanation:
      'El caso de uso solo conoce el contrato. Un adaptador nuevo que lo cumpla se conecta cambiando un par de líneas, y el dominio y el caso de uso no se tocan.',
  },
  {
    question: '¿Qué ventaja tiene que el caso de uso reciba lo que necesita del exterior como parámetro?',
    options: [
      { text: 'En un test se le puede dar una versión de prueba sencilla.' },
      {
        text: 'Se ejecuta más rápido porque evita cargar módulos innecesarios.',
        why: 'La velocidad de ejecución no es el motivo. El beneficio es de organización y de pruebas, no de rendimiento.',
      },
      {
        text: 'No hace falta escribir tests, porque los tipos ya lo garantizan.',
        why: 'Los tipos comprueban que las piezas encajan, no que las reglas hagan lo correcto. Los tests siguen haciendo falta.',
      },
      {
        text: 'Puede reutilizarse en otras aplicaciones sin modificar nada.',
        why: 'Un caso de uso responde a las necesidades de una aplicación concreta. Que pueda reutilizarse en otra no es el motivo de recibir lo que necesita como parámetro.',
      },
    ],
    answer: 0,
    explanation:
      'Como no crea él mismo lo que necesita, se le puede pasar una versión "de mentira" que guarda los datos en memoria. Los tests son rápidos y no dependen de nada externo.',
  },
  {
    question: '¿Qué línea está en el sitio equivocado?',
    code: `export async function cancelarPedido(repo: PedidoRepository, id: string) {
  const pedido = await repo.buscar(id);            // línea 1

  if (pedido.estado === 'enviado') {               // línea 2
    throw new Error('Ya está enviado');
  }

  await fetch('/cancelar/' + id, { method: 'POST' }); // línea 3
}`,
    options: [
      {
        text: 'La línea 1, que pide el pedido a través del contrato.',
        why: 'Está bien colocada: el caso de uso debe pedir lo que necesita a través del contrato, sin saber quién se lo proporciona.',
      },
      {
        text: 'La línea 2, que comprueba si el pedido ya se ha enviado.',
        why: 'Esa línea es una regla del negocio, y quizá encajaría mejor en el dominio, pero no se salta ninguna frontera: no usa nada externo. Busca una línea que sí lo haga.',
      },
      { text: 'La línea 3, que usa una tecnología concreta en vez del contrato.' },
      {
        text: 'Ninguna, el caso de uso puede hacer todo eso.',
        why: 'Hay una línea que hace algo que el caso de uso no debería hacer directamente. Vuelve a leer qué debe conocer el caso de uso del exterior.',
      },
    ],
    answer: 2,
    explanation:
      'El caso de uso solo debe hablar con el contrato. La línea 3 se salta el puerto y ata el código a una tecnología concreta. Debería ser algo como repo.cancelar(id).',
  },
  {
    question: '¿En qué caso NO merece la pena esta estructura?',
    options: [
      {
        text: 'Cuando varias partes de la aplicación comparten las mismas reglas.',
        why: 'Es justo cuando más ayuda: las reglas compartidas se escriben una vez en el dominio, en vez de copiarlas en cada sitio.',
      },
      { text: 'Cuando casi no hay reglas y solo se muestran datos.' },
      {
        text: 'Cuando el origen de los datos puede cambiar con el tiempo.',
        why: 'Es otro caso donde la estructura ayuda mucho: cambiar de origen solo exige un adaptador nuevo.',
      },
      {
        text: 'Cuando se quiere probar la lógica de forma rápida y sencilla.',
        why: 'Es una de las grandes ventajas de esta estructura: las reglas se prueban sin depender de nada externo.',
      },
    ],
    answer: 1,
    explanation:
      'Con muy pocas reglas que proteger, separar en zonas es más trabajo que beneficio. Las otras tres situaciones son justo donde más ayuda.',
  },
];

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [discarded, setDiscarded] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[current];

  function check() {
    if (selected === null) return;
    if (selected === question.answer) {
      setSolved(true);
      if (!failed) setScore((s) => s + 1);
      return;
    }
    setFailed(true);
    setDiscarded((d) => [...d, selected]);
    setSelected(null);
  }

  function choose(index: number) {
    setSelected(index);
    if (solved && index !== question.answer && !discarded.includes(index)) {
      setDiscarded((d) => [...d, index]);
    }
  }

  function next() {
    if (current + 1 === QUESTIONS.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setDiscarded([]);
    setSolved(false);
    setFailed(false);
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setDiscarded([]);
    setSolved(false);
    setFailed(false);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const total = QUESTIONS.length;
    const message =
      score === total
        ? '¡Perfecto! Has entendido todo a la primera.'
        : score >= total * 0.7
          ? 'Muy bien. Repasa las preguntas que has fallado.'
          : 'Merece la pena repasar los capítulos y volver a intentarlo.';
    return (
      <section aria-live="polite">
        <h2>
          Resultado: {score} de {total} a la primera
        </h2>
        <p>{message}</p>
        <button onClick={restart}>Volver a empezar</button>
      </section>
    );
  }

  return (
    <section>
      <p>
        <small>
          Pregunta {current + 1} de {QUESTIONS.length}
        </small>
      </p>
      <progress value={current} max={QUESTIONS.length} aria-label="Progreso" style={{ width: '100%' }} />
      <fieldset style={{ border: 'none', padding: 0, margin: '1rem 0' }}>
        <legend style={{ fontWeight: 700, marginBottom: '.5rem' }}>{question.question}</legend>
        {question.code && (
          <pre>
            <code>{question.code}</code>
          </pre>
        )}
        {question.options.map((option, index) => {
          const isDiscarded = discarded.includes(index);
          const isCorrect = solved && index === question.answer;
          return (
            <div key={option.text}>
              <label
                style={{
                  display: 'block',
                  padding: '.5rem .75rem',
                  margin: '.4rem 0 0',
                  border: '2px solid',
                  borderColor: isCorrect ? 'var(--app)' : isDiscarded ? '#e03131' : 'var(--border)',
                  borderRadius: 6,
                  opacity: isDiscarded ? 0.75 : 1,
                  cursor: !solved && isDiscarded ? 'default' : 'pointer',
                }}
              >
                <input
                  type="radio"
                  name={'pregunta-' + current}
                  checked={selected === index}
                  disabled={!solved && isDiscarded}
                  onChange={() => choose(index)}
                  style={{ marginRight: '.5rem' }}
                />
                {option.text}
                {isCorrect && ' ✓'}
                {isDiscarded && ' ✗'}
              </label>
              {isDiscarded && option.why && (
                <p style={{ margin: '.25rem 0 .5rem .75rem', fontSize: '.9rem' }}>
                  <strong>Por qué no es esta:</strong> {option.why}
                </p>
              )}
            </div>
          );
        })}
      </fieldset>
      <div aria-live="polite">
        {!solved && discarded.length > 0 && <p>No es esa. Lee por qué y prueba con otra opción.</p>}
        {solved && (
          <p>
            <small>Pulsa cualquier otra opción para leer por qué no es la correcta.</small>
          </p>
        )}
        {solved && (
          <blockquote>
            <strong>{failed ? '¡Ahora sí!' : '¡Correcto!'}</strong> {question.explanation}
          </blockquote>
        )}
      </div>
      {solved ? (
        <button onClick={next}>{current + 1 === QUESTIONS.length ? 'Ver resultado' : 'Siguiente'}</button>
      ) : (
        <button onClick={check} disabled={selected === null}>
          Comprobar
        </button>
      )}
    </section>
  );
}
