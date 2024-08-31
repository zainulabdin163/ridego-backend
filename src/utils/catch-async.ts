const CatchAsync = <T extends (...args: any[]) => Promise<any>>(func: T) => {
  return (...args: Parameters<T>) => {
    func(...args).catch((err: any) => {
      // You can handle the error here or pass it to a global error handler
      console.error(err); // For example, just logging it
    });
  };
};

export { CatchAsync };
