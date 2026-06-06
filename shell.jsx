// Shell components: Sidebar, Topbar, layouts, primitives

const { useState, useEffect, useRef, useMemo } = React;
const I = window.Icons;

// ---------------- Sidebar ----------------
const navGroups = [
  {
    label: "Clínico",
    items: [
      { id: "home", label: "Resumen", icon: "Home" },
      { id: "pacientes", label: "Pacientes", icon: "Users", badge: "142" },
      { id: "historia", label: "Historia clínica", icon: "Folder" },
      { id: "triaje", label: "Triaje", icon: "Stethoscope" },
      { id: "ecografias", label: "Ecografías + IA", icon: "Scan", badge: "3" },
      { id: "laboratorio", label: "Laboratorio", icon: "Flask" },
      { id: "partos", label: "Partos", icon: "Baby" },
      { id: "calculadoras", label: "Calculadoras FMF", icon: "Calculator" },
    ],
  },
  {
    label: "Operación",
    items: [
      { id: "alertas", label: "Alertas críticas", icon: "Bell", badge: "5" },
      { id: "ia-asistente", label: "Copiloto IA", icon: "Sparkle" },
    ],
  },
  {
    label: "Administración",
    items: [
      { id: "auditoria", label: "Auditoría", icon: "Shield" },
      { id: "usuarios", label: "Usuarios y roles", icon: "UserPlus" },
      { id: "config", label: "Configuración", icon: "Settings" },
    ],
  },
];

const Sidebar = ({ active, onNav }) => (
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark">F</div>
      <div className="brand-name">Fetal Medical <em>Bolivia</em></div>
    </div>

    {navGroups.map((group) => (
      <div key={group.label}>
        <div className="sidebar-section">{group.label}</div>
        {group.items.map((it) => {
          const Ico = I[it.icon];
          return (
            <div
              key={it.id}
              className={"nav-item" + (active === it.id ? " active" : "")}
              onClick={() => onNav(it.id)}
            >
              <Ico size={16} />
              <span>{it.label}</span>
              {it.badge && <span className="badge">{it.badge}</span>}
            </div>
          );
        })}
      </div>
    ))}

    <div className="sidebar-footer">
      <div className="avatar">RC</div>
      <div className="user-meta">
        <div className="name">Dr. R. Cárdenas</div>
        <div className="role">Médico especialista · Matr. 19842</div>
      </div>
    </div>
  </aside>
);

// ---------------- Topbar ----------------
const Topbar = ({ crumbs, onSearch, onLogout, degraded }) => (
  <header className="topbar">
    <div className="crumbs">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">/</span>}
          {i === crumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
        </React.Fragment>
      ))}
    </div>

    {degraded && (
      <div className="banner warn" style={{ marginLeft: 18, padding: '4px 10px', fontSize: 12 }}>
        <I.AlertTriangle size={14} />
        <span><strong>Modo degradado</strong> · IA en mantenimiento — entrada manual habilitada</span>
      </div>
    )}

    <div className="search">
      <I.Search size={14} />
      <input placeholder="Buscar paciente, CI, código…" />
      <kbd>⌘K</kbd>
    </div>
    <div className="topbar-actions">
      <button className="icon-btn" title="Notificaciones">
        <I.Bell size={16} />
        <span className="dot"></span>
      </button>
      <button className="icon-btn" title="Tema"><I.Sun size={16} /></button>
      <button className="icon-btn" title="Salir" onClick={onLogout}><I.Logout size={16} /></button>
    </div>
  </header>
);

// ---------------- Common primitives ----------------
const Card = ({ title, sub, actions, children, bodyClass = '', noBody = false }) => (
  <div className="card">
    {(title || sub || actions) && (
      <div className="card-header">
        {title && <h3>{title}</h3>}
        {sub && <span className="sub">{sub}</span>}
        {actions && <div className="actions">{actions}</div>}
      </div>
    )}
    {!noBody && <div className={"card-body " + bodyClass}>{children}</div>}
    {noBody && children}
  </div>
);

const Chip = ({ kind = '', children, icon = false }) => (
  <span className={"chip " + kind}>
    {icon && <span className="dot" />}
    {children}
  </span>
);

const Severity = ({ level }) => {
  const map = {
    critical: { cls: 'critical', label: 'Emergencia' },
    warning: { cls: 'warning', label: 'Advertencia' },
    info: { cls: 'info', label: 'Info' },
  };
  const m = map[level];
  return <span className={"severity-tag " + m.cls}>{m.label}</span>;
};

const RiskChip = ({ level }) => {
  const map = {
    alto: { cls: 'danger', label: 'Riesgo alto', icon: true },
    medio: { cls: 'warn', label: 'Riesgo medio', icon: true },
    bajo: { cls: 'ok', label: 'Riesgo bajo', icon: true },
  };
  const m = map[level];
  return <Chip kind={m.cls} icon={m.icon}>{m.label}</Chip>;
};

const PageHeader = ({ title, sub, actions }) => (
  <div className="page-header">
    <div>
      <h1>{title}</h1>
      {sub && <div className="sub">{sub}</div>}
    </div>
    {actions && <div className="actions">{actions}</div>}
  </div>
);

window.Shell = { Sidebar, Topbar, Card, Chip, Severity, RiskChip, PageHeader };
