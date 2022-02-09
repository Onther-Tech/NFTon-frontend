import {ERC20, ETH} from "./assets";
import {isSameAddress} from "./index";
import {assets, assetsByAddress, decimals} from "../constants/contract";
import {formatUnits} from "ethers/lib/utils";
import {parseErc20AssetData} from "./nft";
import {
  SORT_TYPE_MOST_LIKED,
  SORT_TYPE_PRICE_HIGH_TO_LOW,
  SORT_TYPE_PRICE_LOW_TO_HIGH,
  SORT_TYPE_RECENTLY_LISTED
} from "../constants/sort";


export const filterByName = (arr, searchText) => {
  return arr.filter(x => {
    let metadata = x.metadata;

    if (!metadata) {
      metadata = x.order?.makeInfo?.asset;
    }

    if (typeof metadata?.name === 'string') {
      if (metadata.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
        return true;
      }
    }

    return false;
  });
}

export const filterByCategory = (arr, categoryNames) => {
  if (categoryNames.length === 0) {
    return arr;
  }

  return arr.filter(x => {
    if (typeof x.order?.CategoryName === 'string') {
      for (let categoryName of categoryNames) {
        return x.order?.CategoryName.toLowerCase() === categoryName.toLowerCase()
      }
    }
  });
}

export const filterByMediaTypes = (arr, types = []) => {
  if (types.length === 0) {
    return arr;
  }

  return arr.filter(x => {
    let metadata = x.metadata;

    if (!metadata) {
      metadata = x.order?.makeInfo?.asset;
    }

    if (typeof metadata?.type === 'string') {
      for (let type of types) {
        if (metadata.type.indexOf(type) !== -1) {
          return true;
        }
      }
    }

    return false;
  });
}

export const filterByUnit = (arr, symbols) => {
  if (symbols.length === 0) {
    return arr;
  }

  return arr.filter(x => {
    const takeAsset = x.order?.takeAsset;

    if (!takeAsset) {
      return false;
    }

    for (let symbol of symbols) {
      if (symbol === 'ETH' && takeAsset.assetType.assetClass === ETH) {
        return true;
      }

      if (takeAsset.assetType.assetClass === ERC20) {
        const contractAddress = parseErc20AssetData(takeAsset.assetType.data);
        if (isSameAddress(assets[symbol], contractAddress)) {
          return true;
        }
      }
    }

    return false;
  });
}

export const filterByPriceRange = (arr, from, to) => {
  if (from < 0 || to <= from) {
    return arr;
  }

  return arr.filter(x => {
    const takeAsset = x.order?.takeAsset;

    if (!takeAsset) {
      return false;
    }

    let decimal = 18;

    if (takeAsset.assetType.assetClass === ERC20) {
      const contractAddress = parseErc20AssetData(takeAsset.assetType.data);
      const symbol = assetsByAddress[contractAddress];
      decimal = decimals[symbol];
    }

    const value = Number(formatUnits(takeAsset.value, decimal));

    return value >= Number(from) && value <= Number(to);
  });
}

export const filterAndSortList = (list, filter, sortType, searchText) => {
  let arr = [...list];

  if (searchText) {
    arr = filterByName(arr, searchText);
  }

  if (filter.categories) {
    const categoryNames = Object.entries(filter.categories).filter(([k, v]) => v === true).map(([k]) => k);
    arr = filterByCategory(arr, categoryNames);
  }


  if (filter.fileTypes) {
    const types = [];
    if (filter.fileTypes.image) {
      types.push('image');
    } else if (filter.fileTypes.video) {
      types.push('video');
    } else if (filter.fileTypes.audio) {
      types.push('audio');
    }

    arr = filterByMediaTypes(arr, types);
  }

  if (filter.unit) {
    const symbols = Object.entries(filter.unit).filter(([k, v]) => v === true).map(([k]) => k);
    arr = filterByUnit(arr, symbols);
  }

  if (filter.price) {
    arr = filterByPriceRange(arr, filter.price.from, filter.price.to);
  }

  if (sortType === SORT_TYPE_RECENTLY_LISTED) {
    if (arr[0]?.order) {
      arr.sort((a, b) => new Date(a.order?.createdAt) > new Date(b.order?.createdAt) ? -1 : 1);
    }
  } else if (sortType === SORT_TYPE_MOST_LIKED) {
    if (arr[0]?.order) {
      arr.sort((a, b) => a.order?.favoriteCount > b.order?.favoriteCount ? -1 : 1);
    }
  } else if (sortType === SORT_TYPE_PRICE_LOW_TO_HIGH) {
    if (arr[0]?.order) {
      arr.sort((a, b) => a.order?.takeAsset?.value > b.order?.takeAsset?.value ? 1 : -1);
    }
  } else if (sortType === SORT_TYPE_PRICE_HIGH_TO_LOW) {
    if (arr[0]?.order) {
      arr.sort((a, b) => a.order?.takeAsset?.value > b.order?.takeAsset?.value ? -1 : 1);
    }
  }
  return arr;
}
