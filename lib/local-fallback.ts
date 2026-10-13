import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'product-configs.json');

export interface LocalProductConfig {
  slug: string;
  title: string;
  priceXaf: number;
  salePriceXaf?: number | null;
  isOnSale: boolean;
  isFeatured: boolean;
  coverImage?: string | null;
  updatedAt: string;
}

export function getLocalProductConfigs(): Record<string, LocalProductConfig> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(CONFIG_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveLocalProductConfig(config: LocalProductConfig): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const configs = getLocalProductConfigs();
    configs[config.slug] = config;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(configs, null, 2), 'utf8');
  } catch (err) {
    console.error('[saveLocalProductConfig Error]:', err);
  }
}
