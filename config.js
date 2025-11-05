const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    // connectionLimit: 7,
    host: `${process.env.HOST}`,
    port: 3306,
    user: `${process.env.DBUSER}`,
    password: `${process.env.PASSWORD}`,
    database: `${process.env.DBNAME}`,
    multipleStatements: false,
    // debug: true,
    connectionLimit: 50,
    // acquireTimeout: 100000,
    connectTimeout: 10000,
  },
  defaultTemplateId: 1,
  catalogSorting: {
    1: " ASC ",
    2: " DESC ",
  },
  orderSorting: {
    1: " ASC ",
    2: " DESC ",
  },
  imageUrl: "http://tierra-api.vforvaios.gr/images/",
  recordsPerPage: 12,
  mail: {
    options: {
      sendmail: true,
      auth: {
        user: `${process.env.ADMIN_EMAIL}`,
        pass: `${process.env.ADMIN_PASSWORD}`,
      },
    },
    from: `"Tierra" <${process.env.ADMIN_EMAIL}>"`,
    fromActualEmail: process.env.ADMIN_EMAIL,
    toTierraBoutiqueEmail: process.env.TIERRA_BOUTIQUE_EMAIL,
  },
  messages: {
    error: "Wrong data",
  },
  newsletterCoupon: { code: "NEWSLETTER10", discount: 10 },
};

module.exports = config;
