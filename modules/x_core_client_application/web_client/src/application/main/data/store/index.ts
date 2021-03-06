import { AuthContextManager } from "@Main/data/store/AuthContextManager";
import { RouterContextManager } from "@Main/data/store/RouterContextManager";
import { ThemeContextManager } from "@Main/data/store/ThemeContextManager";

export const authContextManager: AuthContextManager = new AuthContextManager();
export const themeContextManager: ThemeContextManager = new ThemeContextManager();
export const routerContextManager: RouterContextManager = new RouterContextManager();

export * from "@Main/data/store/AuthContextManager";
export * from "@Main/data/store/ThemeContextManager";
export * from "@Main/data/store/RouterContextManager";
