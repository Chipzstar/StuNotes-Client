import { useNotesStore } from '../store';

export default BaseComponent => props => {
	const store = useNotesStore();
	return <BaseComponent {...props} store={store} />;
};