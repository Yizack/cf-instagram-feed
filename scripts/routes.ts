import { readdirSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "node:url";
import path from "path";


const routesDir = fileURLToPath(new URL("../src/routes", import.meta.url));

if (!existsSync(routesDir)) throw new Error("No routes found!, please create route files in src/routes");

const routesFiles = readdirSync(routesDir, { recursive: true, withFileTypes: true });

const routeMappings = routesFiles.reduce((acc: { imports: string[], handlers: string[] }, file) => {
  if (file.isDirectory()) return acc;
  const [routeName, routeMethod = "get"] = file.name.split(".");

  const routeSplit = file.parentPath.split(path.join("src", "routes"))[1].split(path.sep);
  const routeJoin = routeSplit.join("/");

  const routePath = `${routeJoin}${routeName === "index" ? "/" : `/${routeName}`}`;
  const importName = toCamelCase([...routeSplit, routeName, routeMethod]);
  const importPath = `../src/routes${routeJoin}/${routeName}.${routeMethod}`;

  acc.imports.push(`import ${importName} from "${importPath}";`);
  acc.handlers.push(`router.${routeMethod}("${routePath}", ${importName});`);
  return acc;
}, { imports: [], handlers: [] });

const routeImports = routeMappings.imports.join("\n");
const routeHandlers = routeMappings.handlers.join("\n");

const routesFolderExists = existsSync(fileURLToPath(new URL("../.routes", import.meta.url)));

if (!routesFolderExists) {
  mkdirSync(fileURLToPath(new URL("../.routes", import.meta.url)));
  console.info("Created .routes folder!");
}

const h3Imports = "import { createApp, createRouter, defineEventHandler } from \"h3\";";
const h3App = `
export const app = createApp();

const router = createRouter();
app.use(router);

router.get("/**", defineEventHandler(() => ({ message: "Not Found" }))); // fallback
`.trim();

const fileContent = `${h3Imports}\n${routeImports}\n\n${h3App}\n${routeHandlers}\n`;

writeFileSync(fileURLToPath(new URL("../.routes/index.ts", import.meta.url)), fileContent, { encoding: "utf-8" });

console.info("Routes generated!");

function toCamelCase (arr: string[]): string {
  return arr.map((word: string, index: number) => {
    if (index === 0) {
      return word.toLowerCase();
    }
    else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  }).join("");
}
