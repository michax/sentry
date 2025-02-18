import {createStore} from 'reflux';

import FormSearchActions from 'sentry/actions/formSearchActions';
import {FieldObject} from 'sentry/components/forms/type';
import {makeSafeRefluxStore, SafeStoreDefinition} from 'sentry/utils/makeSafeRefluxStore';

/**
 * Processed form field metadata.
 */
export type FormSearchField = {
  description: React.ReactNode;
  field: FieldObject;
  route: string;
  title: React.ReactNode;
};

interface StoreInterface {
  get(): InternalDefinition['searchMap'];
  reset(): void;
}

type InternalDefinition = {
  onLoadSearchMap: (searchMap: null | FormSearchField[]) => void;
  searchMap: null | FormSearchField[];
};

interface ExternalIssuesDefinition
  extends SafeStoreDefinition,
    InternalDefinition,
    StoreInterface {}

/**
 * Store for "form" searches, but probably will include more
 */
const storeConfig: ExternalIssuesDefinition = {
  searchMap: null,
  unsubscribeListeners: [],

  init() {
    this.reset();
    this.unsubscribeListeners.push(
      this.listenTo(FormSearchActions.loadSearchMap, this.onLoadSearchMap)
    );
  },

  get() {
    return this.searchMap;
  },

  reset() {
    // `null` means it hasn't been loaded yet
    this.searchMap = null;
  },

  /**
   * Adds to search map
   */
  onLoadSearchMap(searchMap) {
    // Only load once
    if (this.searchMap !== null) {
      return;
    }

    this.searchMap = searchMap;
    this.trigger(this.searchMap);
  },
};

const FormSearchStore = createStore(makeSafeRefluxStore(storeConfig));
export default FormSearchStore;
