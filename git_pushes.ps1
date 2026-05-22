# Enable strict error handling
$ErrorActionPreference = "Stop"

Write-Host "Starting 16 Feature Push Process..." -ForegroundColor Cyan

# Define commits
$commits = @(
  @{
    title = "Initialize Project Configuration & Core Assets"
    files = @(
      "package.json", "package-lock.json", "tsconfig.json", "tsconfig.app.json", 
      "tsconfig.node.json", "vite.config.ts", "eslint.config.js", "index.html", 
      ".gitignore", "README.md", "public/favicon.svg", "public/icons.svg", 
      "src/main.tsx", "src/App.tsx", "src/App.css"
    )
    msg = "feat: initialize project configuration, assets, and documentation"
  },
  @{
    title = "Configure Design System Styling"
    files = @("src/index.css")
    msg = "feat: configure design system CSS variables, custom themes, and animations"
  },
  @{
    title = "App Shell & Routes Layout"
    files = @("src/app/App.tsx", "src/app/routes.tsx")
    msg = "feat: build routes layout shell and sidebar routes routing container"
  },
  @{
    title = "Navbar Component"
    files = @("src/components/Navbar.tsx")
    msg = "feat: implement main Navbar header with user profile levels summary"
  },
  @{
    title = "Sidebar Component"
    files = @("src/components/Sidebar.tsx")
    msg = "feat: implement responsive Sidebar navigation menu with system matrix paths"
  },
  @{
    title = "XP State Engine"
    files = @("src/features/xpSystem/xpSystem.ts")
    msg = "feat: design XP system state engine with dynamic level ups and local storage syncing"
  },
  @{
    title = "Custom UI Component Elements"
    files = @(
      "src/components/Button.tsx", "src/components/XPBar.tsx", 
      "src/components/AnimatedCodeBlock.tsx", "src/assets/react.svg", 
      "src/assets/vite.svg", "src/assets/hero.png"
    )
    msg = "feat: build premium custom Button, XPBar, and AnimatedCodeBlock UI elements"
  },
  @{
    title = "Home, Stats Dashboard & Profile Views"
    files = @("src/pages/Home.tsx", "src/pages/Dashboard.tsx", "src/pages/Profile.tsx")
    msg = "feat: implement Home page, user Stats Dashboard, and Developer Profile pages"
  },
  @{
    title = "Interactive Retro Code Console Terminal"
    files = @("src/components/Terminal.tsx")
    msg = "feat: implement reusable Terminal component for compiling scripts in sandboxes"
  },
  @{
    title = "Training Roadmap Timeline System"
    files = @("src/data/roadmap.ts", "src/pages/Roadmap.tsx")
    msg = "feat: build step-locked Training Roadmap timeline and workspace study modal"
  },
  @{
    title = "React Core Diagnostic Module"
    files = @("src/data/reactLessons.ts", "src/pages/ReactModule.tsx")
    msg = "feat: implement React lessons compiler sandbox and state validation quiz"
  },
  @{
    title = "Backend VM Sandboxing Module"
    files = @("src/data/backendLessons.ts", "src/pages/BackendModule.tsx")
    msg = "feat: design Backend VM lesson playground with SQL security checking"
  },
  @{
    title = "Live API Flow Visualizer Node Matrix"
    files = @("src/pages/ApiVisualizer.tsx")
    msg = "feat: build API Flow visualizer with animated header, proxy, and DB nodes"
  },
  @{
    title = "Network Error Simulator & Firewall Lab"
    files = @("src/data/errorCases.ts", "src/pages/ErrorSimulator.tsx")
    msg = "feat: implement HTTP Error Simulator with animated packet paths and lock screens"
  },
  @{
    title = "Interview Arena Voice Feedback transcription"
    files = @("src/data/interviewQuestions.ts", "src/pages/InterviewArena.tsx")
    msg = "feat: design System Design Interview Arena with simulated mic transcribing"
  },
  @{
    title = "Light/Dark Theme Integration Mode Support"
    files = @()
    msg = "feat: implement global theme context supporting seamless Light Mode customization"
  }
)

for ($i = 0; $i -lt $commits.Length; $i++) {
  $c = $commits[$i]
  $num = $i + 1
  Write-Host "`n[Step $num/16] Staging for: $($c.title)" -ForegroundColor Yellow
  
  if ($c.files.Length -gt 0) {
    foreach ($file in $c.files) {
      if (Test-Path $file) {
        git add $file
      } else {
        Write-Host "Warning: File $file not found!" -ForegroundColor DarkYellow
      }
    }
  } else {
    # Last step: stage remaining files
    git add .
  }
  
  # Check if anything is staged in index
  $diff = git diff --cached --name-only
  if ([string]::IsNullOrWhiteSpace($diff)) {
    Write-Host "No changes staged. Skipping commit." -ForegroundColor Gray
    continue
  }
  
  git commit -m $c.msg
  Write-Host "Committed: $($c.msg)" -ForegroundColor Green
  
  Write-Host "Pushing to remote repository..." -ForegroundColor Blue
  git push origin main
  Write-Host "Success pushing Step $num!" -ForegroundColor Green
}

Write-Host "`nAll 16 features pushed successfully!" -ForegroundColor Green
