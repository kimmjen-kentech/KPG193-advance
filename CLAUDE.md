# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 0. Project Rules (KPG 193)

1. **작성자/기여자 이름 작성 금지** — 커밋 메시지, 코드, 문서 어디에도 작성자·기여자 이름을 넣지 않는다.
2. **Git 브랜치 전략 준수** — 모든 작업은 feature/fix/chore 브랜치에서 진행하고, main에 직접 커밋하지 않는다.
3. **TDD 필수** — 구현 전 테스트를 먼저 작성한다. 테스트 없는 코드는 제출하지 않는다.
4. **작은 단위로** — 커밋, 함수, PR 모두 단일 책임 원칙. 한 번에 하나만 변경한다.
5. **데이터 소수점 절대 자르지 않는다** — 전력·에너지·비용 등 수치 데이터는 반올림·절사 없이 원본 정밀도를 유지한다.
6. **디자인 패턴 적용 필수** — 구조적 결정이 필요할 때 적절한 패턴을 명시하고 적용한다.
7. **장황하게 하지 않는다** — 코드, 응답, 문서 모두 간결하게. 필요한 것만 작성한다.
8. **임의 추론·가정 금지** — 불확실하면 묻는다. 목표 범위를 벗어난 가정을 해서는 안 된다.

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
