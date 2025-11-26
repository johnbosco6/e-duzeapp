export default function NavBar(activeTab = 'home') {
  const getActive = (tab) => tab === activeTab ? 'active' : '';

  return `
    <div class="nav-bar">
      <button class="nav-btn ${getActive('home')}" data-target="home">
        <div class="nav-icon-3d">🏠</div>
        <span>Home</span>
      </button>
      <button class="nav-btn ${getActive('scan')}" data-target="scan">
        <div class="nav-icon-3d">📷</div>
        <span>Scan</span>
      </button>
      <button class="nav-btn ${getActive('deals')}" data-target="deals">
        <div class="nav-icon-3d">🎟️</div>
        <span>Offers</span>
      </button>
      <button class="nav-btn ${getActive('map')}" data-target="map">
        <div class="nav-icon-3d">🗺️</div>
        <span>Map</span>
      </button>
      <button class="nav-btn ${getActive('profile')}" data-target="profile">
        <div class="nav-icon-3d">👤</div>
        <span>Profile</span>
      </button>
    </div>
  `;
}
