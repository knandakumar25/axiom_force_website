/** Shared home links and dedicated pages for the two Axiom Force games. */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../components/Showcase';
import { gameTitles } from './gameTitles';

// Track names and challenges follow the racing repository's GAME_OUTLINE.md.
const cups = [
  ['City Cup', [
    ['Little Tokyo–Skyport', 'Tight market turns open into broad Skyport lanes.'],
    ['Concrete Wards Viaduct', 'Linked bends under elevated roads test drift transitions.'],
    ['Stratos Docks', 'Waterfront straights lead into loading-yard chicanes.'],
    ['Rustrail Junction', 'Sweeping rail-yard corners give way to a tight switchback.'],
  ]],
  ['Skyline Cup', [
    ['Foundry Forge', 'Banked factory turns alternate with slower maintenance bends.'],
    ['Cyber Grave Circuit', 'A winding salvage yard rewards early braking and clean exits.'],
    ['Spire Outer Hull', 'A rising spiral alternates wide drift arcs with tight service bends.'],
    ['Apex Bastion Descent', 'A fortress climb leads to a long descent with blind crests.'],
  ]],
];

/** Link to each title in the visitor's current locale. */
export function GameSelector() {
  const base = useLocalePath();
  const { t } = useTranslation();
  return <nav className="game-selector" aria-label={t('games.selector')}>
    <h2>{t('games.selector')}</h2>
    {Object.entries(gameTitles).map(([slug, title]) => (
      <Link className="button secondary" key={slug} to={`${base}/games/${slug}`}>{title}</Link>
    ))}
  </nav>;
}

/** Introduce the campaign and link to the existing gameplay and squad routes. */
export function AxiomForceGame() {
  const base = useLocalePath();
  const { t } = useTranslation();
  return <div className="showcase-page home-content">
    <header className="game-overview">
      <p className="eyebrow">{t('showcase.inDevelopment')} · 2157</p>
      <h1>{gameTitles['axiom-force']}</h1>
      <p>{t('showcase.intro')}</p>
      <div className="actions">
        <Link className="button" to={`${base}/gameplay`}>{t('showcase.explore')}</Link>
        <Link className="button secondary" to={`${base}/squad`}>{t('showcase.meet')}</Link>
      </div>
    </header>
    <section className="feature-split">
      <h2>{t('showcase.campaign')}</h2>
      <div><p>{t('showcase.combat')}</p><p>{t('showcase.world')}</p></div>
    </section>
  </div>;
}

/** Show the racer’s current status and planned circuits without implying availability. */
export function DriftCircuitGame() {
  const { t } = useTranslation();
  return <div className="showcase-page home-content">
    <header className="game-overview">
      <p className="eyebrow">{t('showcase.inDevelopment')} · 2157</p>
      <h1>{gameTitles['drift-circuit']}</h1>
      <div lang="en" dir="ltr" className="racing-copy">
        <p>A 3D arcade kart racer set in Los Angeles in 2157. Drift to build boost, choose shortcuts, and time your power-ups.</p>
        <p>Development is at the outline stage. The Unity project contains the base 3D template. The first planned playable build is a Little Tokyo–Skyport time trial with ordered checkpoints, safe resets, and a finish result.</p>
      </div>
    </header>
    <section lang="en" dir="ltr" className="racing-copy">
      <h2>Planned circuits</h2>
      <div className="circuit-cups">
        {cups.map(([cup, tracks]) => (
          <section key={cup}>
            <h3>{cup}</h3>
            <dl>{tracks.map(([name, challenge]) => (
              <div key={name}><dt>{name}</dt><dd>{challenge}</dd></div>
            ))}</dl>
          </section>
        ))}
      </div>
    </section>
  </div>;
}
