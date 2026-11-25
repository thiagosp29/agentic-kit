/**
 * Hashes de tudo o que o kit distribuiu até a 0.3.0, antes de existir o registro de instalação.
 * A lista é fechada: o que for instalado pelas versões seguintes fica no registro.
 */
export const HASHES_BEFORE_RECORD: ReadonlyMap<string, readonly string[]> = new Map([
  [
    'agents/architect.md',
    [
      'd11e2ae96c91637a2333cd98961ca0c90ca232baf61a8801f0db6efed4a4c48a',
      '6e89cee2172eebe7c765fdc80d8682bf95287665e39abfb7268f768d69860273',
    ],
  ],
  [
    'agents/code-reviewer.md',
    [
      '8f3d13d7751258b3fd669ab38922b313e4e0813f7b646f7f552385be0dfb4b3c',
      'aa8eef71347088fe949964e7544ad809c593da20a5ae186aa37317dd62fb3843',
    ],
  ],
  [
    'agents/test-engineer.md',
    [
      '83f50a4c7548483b63acbd54f2e677ab0e69c2761329f03c0a36eaab56c4b4bc',
      'ecdb976e18a5bdb605a7da22638b2e01c0dd3453024e0b4d163a4dac09669098',
    ],
  ],
  ['knowledge/clean-architecture.md', ['ed671a2aab149f6fd31fe8d814993133ae37ce6cb82ad726fe75178958311ad6']],
  ['knowledge/clean-code.md', ['f909490e1b753ef4bdf6b1367dea5af6a8cdd6601cedcb7a61633587095a9030']],
  ['knowledge/error-handling.md', ['4b631932232b156be9dd8a4568cf22a6c2fd89ff8ad58bcfebfa6386e87de7ac']],
  ['knowledge/git-workflow.md', ['84c7f37be6bb740c8110a476a0078a063a2cbf68128127fc1b34bfd6aea0e9fb']],
  ['knowledge/solid.md', ['9d2c02b2ec37cfd5c95f0d0a876bc8acf4ae66b4c604d2dc4fe1d34044adab90']],
  ['knowledge/testing.md', ['6336b9e52bf81d2f5252a4f424b14c3df7adf0a99b936a3d90db7f57fe5e095f']],
  ['skills/adr/SKILL.md', ['32cbefb14d888b194b3eb776b9e9125ab7de2692cf1f797bc441c4349f427de4']],
  ['skills/code-review/SKILL.md', ['278235e848e5cdb4595027cff05a480787d791e16ad577f707ec6329427b0b7c']],
  ['skills/commit-message/SKILL.md', ['841411315e970345ecf88113e002b36375b174d6c2e962b1148a6d484e5f219a']],
  ['skills/debug/SKILL.md', ['3b343903cbcbd73982173753b916bda9d526da0ef3730d24b2bfd1f22e47c5fb']],
  ['skills/refactor/SKILL.md', ['89ad4a0691f17019793e46f58b56a0074741fa592ddaec769461ca4902cb41c4']],
  ['skills/time-de-produto/SKILL.md', ['fe5d1203b8244af356c13e96b61d81de51c5cfd0ec95fe7fc55b53ff5b93a08c']],
  [
    'skills/time-de-produto/backlog-template.md',
    ['45648b35ad1d66e02ed9212e825ce6918260e0fa5bb941ddff4d14e72dfa51ff'],
  ],
  ['skills/write-tests/SKILL.md', ['50a77451ae7c2cd9a9875a4c19f5f688b5b0189210c6ac35b46ea71c73a599e5']],
]);
