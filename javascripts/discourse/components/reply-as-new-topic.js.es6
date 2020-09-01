import Component from "@ember/component";
import { withPluginApi } from "discourse/lib/plugin-api";
import { next } from "@ember/runloop";
import { getOwner } from "discourse-common/lib/get-owner";
import Composer from "discourse/models/composer";
import { escapeExpression } from "discourse/lib/utilities";

export default Component.extend({
  actions: {
    createLinkedTopic() {
      const topic = this.topic;
      const postStream = this.get("topic.postStream");
      const postId = postStream.findPostIdForPostNumber(1);
      const post = postStream.findLoadedPost(postId);

      const opts = {
        action: Composer.CREATE_TOPIC,
        draftKey: Composer.NEW_TOPIC_KEY,
      };

      withPluginApi("0.8", (api) => {
        next(() => {
          const title = escapeExpression(topic.title);
          const postUrl = `${location.protocol}//${location.host}${post.url}`;
          const postLink = `[${title}](${postUrl})`;
          const text = `${I18n.t("post.continue_discussion", {
            postLink,
          })}`;

          const controller = getOwner(this).lookup("controller:composer");
          controller.open(opts).then(() => {
            controller.model.prependText(text, { new_line: true });
          });
        });
      });
    },
  },
});
