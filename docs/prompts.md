# Plant Care Web App — Standard Prompt Templates

This file documents the standardized prompts used by Pruthviraj Kale to guide the agent through every phase of the project.

---

## 1. Orientation Prompt
```text
I am Pruthviraj Kale, Member 4 (App & UI/UX Lead) in a 5-member college project. Read ANTIGRAVITY_SETUP.md, CLAUDE.md, and all files in docs/. Summarize the project, boundaries, and ticket order. Then ask me the unanswered Batch 1 questions from docs/grilling.md.
```

## 2. Grill Prompt
```text
Read docs/grilling.md. Ask me the unanswered questions from Batch [X] (5 questions at a time). Do not proceed until we have aligned on these answers.
```

## 3. Design System Prompt
```text
Start ticket A-00: Design system. Show me the planned design tokens, color palette, typography, and responsive component states (360px support) before editing.
```

## 4. Ticket Check Prompt
```text
What is the next ticket in the pipeline? Check prerequisites, dependencies, and test requirements before proceeding.
```

## 5. Ticket Workflow Prompts (Per Ticket A-xx)

### Step 5.1: Plan
```text
Plan ticket A-[XX]: <Ticket Title>. Detail the files to create/modify, the test strategy, and edge cases. Do not write code yet.
```

### Step 5.2: Tests First
```text
Write tests first for ticket A-[XX]. Confirm tests fail appropriately before implementing code.
```

### Step 5.3: Implement
```text
Implement ticket A-[XX] based on the approved plan and failing tests. Keep diffs small and focused.
```

### Step 5.4: Code Review
```text
Review code for ticket A-[XX]. Check adherence to TypeScript types, 360px mobile responsiveness, loading/empty/error states, and naming conventions ("Grow light", never "UV light").
```

### Step 5.5: Security Review
```text
Perform security review on ticket A-[XX]. Verify no secrets leaked, Firebase rules integrity, no dangerouslySetInnerHTML/eval, and proper input sanitization.
```

### Step 5.6: Commit & Complete
```text
Summarize the git commit message and diff for ticket A-[XX]. Await my command before starting the next ticket.
```
