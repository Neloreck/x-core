import {EntryPoint} from "@redux-cbd/utils";
import {green, red} from "colors";
import {Compiler, Configuration, default as webpack, Output} from "webpack";

import {PROJECT_OUTPUT_PATH, PROJECT_ROOT_PATH, WEBPACK_CONFIG} from "./config/webpack.config";

@EntryPoint()
export class BuildRunner {

  public static readonly SERVER_PUBLIC_PATH: string = "/public/spa/";
  public static readonly STATS_PRINT_CONFIG: object = { colors: true };

  public static main(): void {

    const config: Configuration = WEBPACK_CONFIG;
    (config.output as Output).publicPath = ClientBuilder.SERVER_PUBLIC_PATH;

    const compiler: Compiler = webpack(config);

    process.stdout.write(
      `Started building client bundle in ${green(process.env.NODE_ENV || "unselected")} mode. \n` +
      `Project root: '${PROJECT_ROOT_PATH}', project output: '${PROJECT_OUTPUT_PATH}'.`
    );

    compiler.run((error: any, stats: any): void => {
      if (error) {
        process.stdout.write(red("\nFailed to build client bundle: " + "\n" +
          error.toString(ClientBuilder.STATS_PRINT_CONFIG) + "\n"));
      } else {
        process.stdout.write(green("\nSuccessfully built client bundle: " + "\n" +
          stats.toString(ClientBuilder.STATS_PRINT_CONFIG) + "\n"));
      }
    });
  }

}
