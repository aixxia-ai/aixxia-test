import LogoutButton from './LogoutButton';

export const metadata = { title: 'Klankbordgroep — AIXXIA' };

export default function Board() {
  return (
    <main className="card wide">
      <span className="badge">Beveiligde pagina</span>
      <div className="brand">Klankbordgroep</div>
      <p className="lead">
        <span className="dot"></span>
        Je bent binnen. Deze pagina is alleen bereikbaar ná de toegangscontrole.
      </p>
      <div className="panel">
        Dit is de beschermde ruimte waar straks je expert-agents draaien. Zonder geldige
        toegangscode wordt deze pagina server-side geblokkeerd — je komt hier nooit, ook
        niet via de directe URL.
      </div>
      <LogoutButton />
    </main>
  );
}
