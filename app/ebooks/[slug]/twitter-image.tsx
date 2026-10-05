import OpenGraphImage, {
  size as ogSize,
  contentType as ogContentType,
} from './opengraph-image';

export const size = ogSize;
export const contentType = ogContentType;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TwitterImage({ params }: Props) {
  return OpenGraphImage({ params });
}
