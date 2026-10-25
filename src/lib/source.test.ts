import { describe, expect, it } from 'vitest';
import { sourceLabel } from './source';

describe('sourceLabel', () => {
  it.each([
    ['https://www.ambitiouskitchen.com/chipotle-salmon-tacos/', 'ambitiouskitchen.com', 'https://www.ambitiouskitchen.com/chipotle-salmon-tacos/'],
    ['https://britacooks.com/spicy-yellow-curry/', 'britacooks.com', 'https://britacooks.com/spicy-yellow-curry/'],
    ['http://example.com', 'example.com', 'http://example.com'],
  ])('shortens a link to its site: %s', (source, text, href) => {
    expect(sourceLabel(source)).toEqual({ text, href });
  });

  it('keeps free text as it is, with no link', () => {
    expect(sourceLabel('Mor Mor')).toEqual({ text: 'Mor Mor' });
  });

  it('treats something that only starts like a link but is not one as text', () => {
    expect(sourceLabel('https://')).toEqual({ text: 'https://' });
  });
});
