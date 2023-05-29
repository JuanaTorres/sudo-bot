const fetchUtils = require("./ops/fetchUtils");
const adminUtils = require("./ops/admin");
const userUtils = require("./ops/user");

const setupCommands = async (botIO, estamos) => {
  // usermod
  if (botIO.match("\\s(usermod)*(\\s[^\\s\\n]+)")) {
    const umodSplit = botIO._msg.content
      .trim(/\s+/)
      .replace(botIO._prefixRegexBuilder("\\susermod"), "")
      .trim(/\s+/)
      .split(/\s/);
    console.log(umodSplit);

    // TODO: ponerle un trycatch a esto pq el bot se muere si no se pone @
    switch (umodSplit[0]) {
      case "-m" || "--mute":
        break;
      case "-n" || "--rename" || "--name" || "--nick" || "--nickname":
        userUtils.changeNicknameNotSemester(
          botIO,
          umodSplit[1].replace(/\<\@|\>/gm, ""),
          umodSplit[2]
        );
        break;
      case "-um" || "--unmute":
        break;
      case "-k" || "--kick":
        break;
      case "-b" || "--ban":
        adminUtils.banMemberFromMention(botIO, umodSplit[1], (options = {}));
        break;
      case "-ub":
      case "--unban":
        adminUtils.unbanMemberFromQuery(botIO, umodSplit[1], (options = {}));
        break;
      case "-h":
      case "--help":
        console.log("pidieron ayuda :V");
        break;
    }

    estamos.melos = true;
    return;
  }

  // grep
  // TODO: agregarle su comandito de --help
  if (botIO._prefixRegexBuilder("\\s(grep)*(\\s[^\\s\\n]+)")) {
    const grepRegExec = botIO
      ._prefixRegexBuilder("\\s(grep)*(\\s[^\\n]+)")
      .exec(botIO._msg.content);

    if (grepRegExec) {
      fetchUtils.fetchMembersAndList(
        botIO._bot,
        botIO._msg.guildID,
        botIO._msg.channel.id,
        grepRegExec[2].trim()
      );

      estamos.melos = true;
      return;
    }
  }

  if (botIO.match("\\s(gpt)*(\\s[^\\s\\n]+)")) {
    const msj = botIO._msg.content
      .replace(botIO._prefixRegexBuilder("\\sgpt"), "")
      .trim(/\s+/);
    const split = [msj.match(/\-\w|--\w+/)[0], msj.replace(/\-\w/, "").trim()];

    let response;
    let parsedResponse;
    switch (split[0]) {
      case "-e" || "--explain":
        // explicar simplecito

        response = await botIO._openai.createCompletion({
          model: "text-davinci-003",
          prompt: `
        Eres "Sudo", un bot de Discord que interactúa con IA para asistir al GPC (Grupo de Programación Competitiva) de la Universidad El Bosque.

Sudo, ahora mismo requerimos de tu ayuda, pues se ha invocado el comando \`sudo gpt --explain\`, para el cual el usuario espera una respuesta simple de no más de dos párrafos, que se sienta conversacional y que de la ilusión de que la redactó un compañero ingeniero. Este es el formato que utilizarás para resolver la tarea:

---

A manera de ejemplo, aquí tienes una respuesta a la solicitud "Qué es RegExp en JavaScript"

"Una expresión regular, también conocida como RegExp, es un patrón de búsqueda que se utiliza para realizar búsquedas y reemplazos sobre cadenas de texto. Se usan con mucha frecuencia en programación de lenguajes de scripting, como JavaScript para localizar y manipular patrones de texto."

La solicitud que se te hizo y para la cual deberás generar un JSON, siguiendo el formato que se te dio anteriormente, es:
"${split[1]}"

"`,
          max_tokens: 780,
          temperature: 0.99,
        });

        parsedResponse = response.data.choices[0].text.replace('"', "");

        botIO.say(botIO._msg.author.mention, parsedResponse);
        break;
      case "-d" || "--doc" || "--detail" || "--detailed":
        // explicar detalladito

        response = await botIO._openai.createCompletion({
          model: "text-davinci-003",
          prompt: `
          Eres "Sudo", un bot de Discord que interactúa con IA para asistir al GPC (Grupo de Programación Competitiva) de la Universidad El Bosque.

Sudo, ahora mismo requerimos de tu ayuda, pues se ha invocado el comando \`sudo gpt --doc\`, para el cual el usuario espera una respuesta cuya calidad sea equiparable a la de la documentación de un lenguaje, una librería y/o demás tecnologías de ingeniería de software. Este es el formato que utilizarás para resolver la tarea:

\`\`\`json
{
  "title": String,
  "body": String,
  "codeblock": {
    "language": String,
    "content": String
  }
}

- \`title\` | un título corto que resuma el contenido
- \`language\` | un string que representa al lenguaje (soportado por highlight.js) utilizado en \`content\` (ej. js, json, c, cpp, elm, elixir, etc.)

---

A manera de ejemplo, aquí tienes un ejemplo de una respuesta a la solicitud "Qué es RegExp en JavaScript".
- Fíjate como en el JSON de respuesta, todo es compacto. No hay saltos de línea a excepción de los caracteres '\\n'. Así necesitamos que sea tu respuesta también, solo utilizando '\\n' para especificar saltos de línea. De otra manera, el JSON podría ser inprocesable.
- De paso, fíjate en como cualquier uso de apóstrofes (\"\") está escapado para evitar errores de procesamiento.

\`\`\`json
{"title":"Expresiones Regulares (RegExp) en JavaScript","body":"Una expresión regular, también conocida como RegExp, es un patrón de búsqueda que se utiliza para realizar búsquedas y reemplazos sobre cadenas de texto. Se usan con mucha frecuencia en programación de lenguajes de scripting, como JavaScript para localizar y manipular patrones de texto.","codeblock":{"language":"js","content":"const numberRegex = /^\\d+$/;\\n//Ejemplo de uso:\\n    const str = \\\"12345\\\";\\n    if (numberRegex.test(str)) {\\n    console.log('La cadena contiene solo números');\\n    } else {\\n        console.log('La cadena contiene caracteres no numéricos');\\n    }"}}

La solicitud que se te hizo y para la cual deberás generar un JSON, siguiendo el formato que se te dio anteriormente, es:
"${split[1]}"

\`\`\`json`,
          max_tokens: 780,
          temperature: 0.99,
        });

        console.log(response.data.choices[0].text);

        parsedResponse = JSON.parse(response.data.choices[0].text);

        botIO.say(
          botIO._msg.author.mention + "\n",
          `**${parsedResponse.title}**` + "\n",
          parsedResponse.body,
          `\`\`\`${parsedResponse.codeblock.language}\n${parsedResponse.codeblock.content}\`\`\``
        );

        break;
    }

    estamos.melos = true;
    return;
  }

  const errorMsgs = [
    "Deje de inventar comandos",
    "¿Qué? Intente de nuevo",
    "Nones, no conozco ese comando",
    "Algo escribió mal, porque ese comando no existe",
    "Sea serio, ese comando no existe",
    "Mire bien los docs, mongolo. Así no es el comando",
    "Deje de inventar, ese comando no es así",
    "Soy bot, no adivino. Escriba eso bien",
    "Fíjese bien, creo que la embarró",
    "Npi qué quiso decir",
    "¿Cómo? No le entendí nada",
    "Ese comando no existe, alucín",
    "¿Aaaaaah? ¿Cómo así?",
    "Mero visaje que ese comando existiera",
    "Escriba bien o le meto su taponazo",
    "O escribe bien o lo chuzo",
  ];

  botIO.say(
    `Capa8_Error: ${errorMsgs[Math.floor(Math.random() * errorMsgs.length)]}`
  );

  estamos.melos = true;
  return;
};

module.exports = setupCommands;
