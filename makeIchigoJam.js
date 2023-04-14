import { CSV } from "https://js.sabae.cc/CSV.js";

const url = "https://ichigojam.github.io/doc/IchigoJam-BASIC-command-list.csv";
const data = await CSV.fetchJSON(url);
console.log(data[0]);
const java = `public class MIKA_IchigoJam {
  public static String NAME = "IchigoJam練習";
  public static String[] SEQ = {
${data.map(d => `    "${d["schema:name"].replace(/\"/g, "\\\"")}"`).join(",\n")}
  };
}
`;
await Deno.writeTextFile("MIKA_IchigoJam.java", java);
