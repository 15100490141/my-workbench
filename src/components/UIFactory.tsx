type ComponentType = "button" | "input" | "select";

const components = {
  button: (props: any) => (
    <button
      {...props}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    />
  ),
  input: (props: any) => (
    <input
      {...props}
      className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  ),
  select: (props: any) => (
    <select
      {...props}
      className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  ),
};

export const createComponent = (type: ComponentType, props: any) => {
  const Component = components[type];
  return <Component {...props} />;
};
