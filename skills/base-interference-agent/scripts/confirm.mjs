// Human-only confirmation. Works only in an interactive terminal: the person types the exact phrase.
// A script run without a terminal (for example by an agent) is refused, even with --confirm.
import readline from "node:readline";
export async function humanConfirm(phrase, question) {
  if (!process.stdin.isTTY) return { ok: false, reason: "no interactive terminal; a human must run this and type the confirmation" };
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((res) => rl.question(`${question}\nType ${phrase} to continue: `, res));
  rl.close();
  return answer.trim() === phrase ? { ok: true } : { ok: false, reason: "confirmation did not match; nothing was sent" };
}
