import sample from "../../../data/sample.json";
import type { ChineseColor, Dataset } from "./types";

export const dataset = sample as unknown as Dataset;
export const colors: ChineseColor[] = dataset.colors;
export const meta = dataset.meta;

export const FAMILIES = ["赤", "黄", "绿", "青", "蓝", "紫", "白", "黑", "褐"] as const;

export const FAMILY_EN: Record<string, string> = {
  赤: "Red",
  黄: "Yellow",
  绿: "Green",
  青: "Cyan",
  蓝: "Blue",
  紫: "Purple",
  白: "White",
  黑: "Black",
  褐: "Brown",
};

export const CRED_EN: Record<string, string> = {
  古籍直证: "Ancient-text attestation",
  文物取色: "Artifact-sampled",
  现代整理: "Modern compilation",
  近似转译: "Approximate conversion",
};

export const ROLE_EN: Record<string, string> = {
  起色: "Opening",
  承色: "Succeeding",
  转色: "Turning",
  合色: "Combining",
};

export const SITE = "https://yivadigital.com";
export const REPO = "https://github.com/madfeifei/yiva-chinese-colors";
