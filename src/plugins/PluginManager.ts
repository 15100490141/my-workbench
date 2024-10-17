type Plugin = {
  name: string;
  component: React.ComponentType;
  menuItem: {
    name: string;
    path: string;
    icon: string;
  };
};

class PluginManager {
  private plugins: Plugin[] = [];

  registerPlugin(plugin: Plugin) {
    this.plugins.push(plugin);
  }

  getPlugins() {
    return this.plugins;
  }

  getMenuItems() {
    return this.plugins.map((plugin) => plugin.menuItem);
  }
}

export const pluginManager = new PluginManager();
