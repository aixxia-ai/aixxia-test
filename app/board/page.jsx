import Chat from './Chat';
import LogoutButton from './LogoutButton';

export const metadata = { title: 'Klankbordgroep — AIXXIA' };

export default function Board() {
  return (
    <main className="card wide board">
      <div className="board-head">
        <div>
          <span className="badge">Klankbordgroep</span>
          <div className="brand small">Strategie-sparringpartner</div>
        </div>
        <LogoutButton />
      </div>
      <Chat />
    </main>
  );
}
