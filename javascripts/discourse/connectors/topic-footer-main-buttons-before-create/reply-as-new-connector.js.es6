import Category from "discourse/models/category";

export default {
  shouldRender(args, component) {
    const category = args.topic.category;
    if (component.currentUser && !category.permission) {
      return true;
    } else return false;
  },
};
