import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from '../../src/core/frontmatter.js';

describe('parseFrontmatter', () => {
  it('lê atributos escalares e separa o corpo', () => {
    const result = parseFrontmatter('---\nname: code-review\ndescription: Revisa código\n---\n# Título\n');

    expect(result.attributes).toEqual({ name: 'code-review', description: 'Revisa código' });
    expect(result.body).toBe('# Título\n');
  });

  it('remove aspas simples e duplas dos valores', () => {
    const result = parseFrontmatter(`---\na: "com: dois pontos"\nb: 'simples'\n---\n`);

    expect(result.attributes).toEqual({ a: 'com: dois pontos', b: 'simples' });
  });

  it('aceita quebras de linha do Windows', () => {
    const result = parseFrontmatter('---\r\nname: x\r\n---\r\ncorpo');

    expect(result.attributes).toEqual({ name: 'x' });
    expect(result.body).toBe('corpo');
  });

  it('ignora linhas que não são atributos de primeiro nível', () => {
    const result = parseFrontmatter('---\nname: x\ntools:\n  - Read\n---\n');

    expect(result.attributes).toEqual({ name: 'x', tools: '' });
  });

  it.each([
    ['sem frontmatter', '# Só corpo'],
    ['frontmatter sem fechamento', '---\nname: x\n'],
  ])('retorna o documento inteiro como corpo quando está %s', (_case, source) => {
    expect(parseFrontmatter(source)).toEqual({ attributes: {}, body: source });
  });
});
