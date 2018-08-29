'user strict'

module.exports = (dbInstance, DataTypes) => {
  const CoinmarketcapTick = dbInstance.define('coinmarketcapTick', {
    market_id: {
        type: DataTypes.STRING,
        required: true
    },
    name: {
        type: DataTypes.STRING,
        required: true
    },
    symbol: {
        type: DataTypes.STRING,
        required: true
    },
    rank: {
        type: DataTypes.INTEGER,
        required: true
    },
    price_usd: {
      type: DataTypes.DECIMAL(18, 8)
    },
    price_btc: {
      type: DataTypes.DECIMAL(18, 8)
    },
    vol_24h_usd: {
      type: DataTypes.DECIMAL(18, 2)
    },
    market_cap_usd: {
      type: DataTypes.DECIMAL(18, 2)
    },
    available_supply: {
      type: DataTypes.DECIMAL(18, 2)
    },
    total_supply: {
      type: DataTypes.DECIMAL(18, 2)
    },
    max_supply: {
      type: DataTypes.DECIMAL(18, 2)
    },
    percent_change_1h: {
      type: DataTypes.DECIMAL(18, 2)
    },
    percent_change_24h: {
      type: DataTypes.DECIMAL(18, 2)
    },
    percent_change_7d: {
      type: DataTypes.DECIMAL(18, 2)
    },
    last_updated: {
      type: DataTypes.INTEGER
    }
  }, {
    paranoid: true
  });
  return CoinmarketcapTick;
};
