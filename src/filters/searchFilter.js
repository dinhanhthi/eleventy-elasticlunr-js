const elasticlunr = require("elasticlunr");

module.exports = function(collection) {
  var index = elasticlunr(function() {
    this.addField("title");
    this.addField("excerpt");
    this.addField("genres");
		this.setRef("id");
		this.addField("content");
  });

  collection.forEach(page => {
    index.addDoc({
      id: page.url,
      title: page.data.title,
      excerpt: page.data.excerpt,
			genres: page.data.genres,
			content: page.templateContent
    });
  });

  return index.toJSON();
};
