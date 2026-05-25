/* ═══════════════════════════════════════════════════════════
   shared.js  —  Shared state, helpers, and components
   Used by every page in the GroupMate prototype
══════════════════════════════════════════════════════════ */

const GM = {
  user: JSON.parse(sessionStorage.getItem('gm_user') || 'null'),
  members: [
    { name:'Thabo Mokoena',   initials:'TM', color:'#F4A261', role:'Team Lead'  },
    { name:'Sipho Mthembu',   initials:'SM', color:'#52B788', role:'Researcher' },
    { name:'Nandi Pretorius', initials:'NP', color:'#457B9D', role:'Writer'     },
    { name:'Kefilwe Sithole', initials:'KS', color:'#9B5DE5', role:'Editor'     },
    { name:'Luca Ferreira',   initials:'LF', color:'#E76F51', role:'Designer'   },
  ],
  get tasks() {
    return JSON.parse(sessionStorage.getItem('gm_tasks') || JSON.stringify([
      { id:1, name:'Write Introduction',     assignee:'Sipho Mthembu',    deadline:'2026-05-20', status:'done',        priority:'high'   },
      { id:2, name:'Literature Review',       assignee:'Nandi Pretorius',  deadline:'2026-05-23', status:'todo',        priority:'high'   },
      { id:3, name:'Research Methodology',    assignee:'Nandi Pretorius',  deadline:'2026-05-28', status:'in-progress', priority:'medium' },
      { id:4, name:'Data Collection',         assignee:'Kefilwe Sithole',  deadline:'2026-05-30', status:'in-progress', priority:'medium' },
      { id:5, name:'Design Prototype',        assignee:'Luca Ferreira',    deadline:'2026-05-31', status:'in-progress', priority:'medium' },
      { id:6, name:'Results & Analysis',      assignee:'Thabo Mokoena',    deadline:'2026-06-01', status:'todo',        priority:'high'   },
      { id:7, name:'Conclusion & References', assignee:'Thabo Mokoena',    deadline:'2026-06-02', status:'done',        priority:'low'    },
      { id:8, name:'Compile Final Document',  assignee:'Sipho Mthembu',    deadline:'2026-06-04', status:'done',        priority:'high'   },
    ]));
  },
  saveTasks(t) { sessionStorage.setItem('gm_tasks', JSON.stringify(t)); },
  get files() {
    return JSON.parse(sessionStorage.getItem('gm_files') || JSON.stringify([
      { name:'Introduction_v2.docx', type:'docx', size:'48 KB',  by:'Sipho Mthembu',   date:'Today'     },
      { name:'Research_Notes.pdf',   type:'pdf',  size:'1.2 MB', by:'Nandi Pretorius', date:'Yesterday' },
      { name:'Project_Brief.pdf',    type:'pdf',  size:'220 KB', by:'Thabo Mokoena',   date:'21 May'    },
      { name:'Data_Survey.xlsx',     type:'xlsx', size:'88 KB',  by:'Kefilwe Sithole', date:'20 May'    },
      { name:'UI_Mockups.pptx',      type:'pptx', size:'3.4 MB', by:'Luca Ferreira',   date:'19 May'    },
    ]));
  },
  saveFiles(f) { sessionStorage.setItem('gm_files', JSON.stringify(f)); },
  notifications: [
    { type:'red',    title:'Task Overdue',         body:'Literature Review was due on 23 May',         time:'2 hours ago', read:false },
    { type:'orange', title:'Deadline Approaching',  body:'Research Methodology due in 4 days',         time:'8 hours ago', read:false },
    { type:'green',  title:'Task Completed',        body:'Sipho Mthembu marked Introduction as done', time:'Yesterday',   read:true  },
    { type:'green',  title:'Task Completed',        body:'Compile Final Document marked as done',      time:'2 days ago',  read:true  },
    { type:'orange', title:'New File Uploaded',      body:'Nandi uploaded Research_Notes.pdf',          time:'3 days ago',  read:true  },
  ],
};

function requireAuth() { if (!GM.user) window.location.href = '../index.html'; }
function saveUser(u) { GM.user = u; sessionStorage.setItem('gm_user', JSON.stringify(u)); }
function logout() { sessionStorage.removeItem('gm_user'); window.location.href = '../index.html'; }

let _toastTimer;
function toast(msg, type='success') {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id='toast'; el.className='toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.className = `toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-ZA', { day:'numeric', month:'short' });
}
function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function initials(name) { return name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase(); }
function memberColor(name) { const m=GM.members.find(x=>x.name===name); return m?m.color:'#9A948E'; }
function memberInitials(name) { const m=GM.members.find(x=>x.name===name); return m?m.initials:name.substring(0,2).toUpperCase(); }

function buildSidebar(activePage) {
  const user = GM.user || { name:'Student' };
  const ini  = initials(user.name);
  const icons = {
    grid:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    check:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    chat:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    bell:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    users:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  };
  const nav = [
    { label:'Dashboard',     icon:'grid',   href:'dashboard.html',     id:'dashboard'     },
    { label:'Tasks',         icon:'check',  href:'tasks.html',          id:'tasks'         },
    { label:'Group Chat',    icon:'chat',   href:'chat.html',           id:'chat',  badge:3 },
    { label:'Files',         icon:'folder', href:'files.html',          id:'files'         },
    { label:'Notifications', icon:'bell',   href:'notifications.html',  id:'notifications', badge:2 },
    { label:'Members',       icon:'users',  href:'members.html',        id:'members', section:'Group' },
  ];
  let html = `<nav class="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
      <span class="sidebar-logo-text">Group<span>Mate</span></span>
    </div>
    <div class="nav-section-label">Main</div>`;
  nav.forEach(item => {
    if (item.section) html += `<div class="nav-section-label">${item.section}</div>`;
    const active = activePage === item.id ? 'active' : '';
    const badge  = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
    html += `<a class="nav-item ${active}" href="${item.href}">${icons[item.icon]}<span>${item.label}</span>${badge}</a>`;
  });
  html += `<div class="sidebar-footer">
    <a class="user-pill" href="#" onclick="logout();return false;">
      <div class="avatar avatar-md" style="background:var(--accent);color:white">${ini}</div>
      <div class="user-info"><div class="user-name">${escapeHtml(user.name)}</div><div class="user-role">Sign out</div></div>
    </a></div></nav>`;
  return html;
}

function buildTopbar(title, extraActions='') {
  return `<div class="topbar">
    <div class="topbar-title">${title}</div>
    <div class="topbar-actions">
      ${extraActions}
      <a href="notifications.html" class="icon-btn" title="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <div class="notif-dot"></div>
      </a>
    </div>
  </div>`;
}

function taskHTML(t, showDelete=false) {
  const isDone    = t.status === 'done';
  const chipClass = isDone ? 'chip-green' : t.status==='in-progress' ? 'chip-orange' : 'chip-grey';
  const chipLabel = isDone ? 'Done' : t.status==='in-progress' ? 'In Progress' : 'To Do';
  const pTag = t.priority==='high' ? `<span class="tag tag-orange" style="margin-left:6px">High</span>`
             : t.priority==='low'  ? `<span style="font-size:11px;color:var(--text-3);margin-left:6px">Low</span>` : '';
  const ini   = memberInitials(t.assignee);
  const color = memberColor(t.assignee);
  const del   = showDelete ? `<button class="icon-btn" style="width:30px;height:30px;border-radius:8px" onclick="askDelete(${t.id})" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>` : '';
  return `<div class="task-item" id="task-${t.id}">
    <div class="task-check ${isDone?'done':''}" onclick="toggleTask(${t.id})"></div>
    <div class="task-info">
      <div class="task-name ${isDone?'done':''}">${escapeHtml(t.name)}${pTag}</div>
      <div class="task-meta"><span class="avatar" style="background:${color};color:white;width:16px;height:16px;font-size:8px;display:inline-flex;vertical-align:middle;margin-right:4px">${ini}</span>${escapeHtml(t.assignee)} · Due ${formatDate(t.deadline)}</div>
    </div>
    <div class="task-actions"><span class="chip ${chipClass}">${chipLabel}</span>${del}</div>
  </div>`;
}

function confirmDialogHTML() {
  return `<div class="confirm-overlay" id="confirm-delete">
    <div class="confirm-box">
      <div class="confirm-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></div>
      <div class="confirm-title">Delete this task?</div>
      <div class="confirm-body">This cannot be undone. The task will be permanently removed.</div>
      <div class="confirm-actions">
        <button class="btn btn-outline" style="flex:1" onclick="closeConfirm()">Cancel</button>
        <button class="btn btn-danger"  style="flex:1" onclick="confirmDelete()">Delete Task</button>
      </div>
    </div>
  </div>`;
}
