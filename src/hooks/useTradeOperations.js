import { useContext } from 'react';
import { createTradeGroup as apiCreateTradeGroup, updateTradeGroup as apiUpdateTradeGroup } from '../services/api';
import { GlobalTradeDataContext } from '../contexts/GlobalTradeDataContext'; // Adjust path as necessary

const useTradeOperations = () => {
    const { setTradeGroups } = useContext(GlobalTradeDataContext);

    const createTradeGroup = async (name, underlying, type, category) => {
        try {
            const newTradeGroup = await apiCreateTradeGroup({ name, underlying, type, category });
            setTradeGroups(prevGroups => [...prevGroups, newTradeGroup]);
            return newTradeGroup;
        } catch (error) {
            console.error('Failed to create trade group', error);
            throw error;
        }
    };

    const updateTradeGroup = async (tradeGroup) => {
        try {
            const updatedTradeGroup = await apiUpdateTradeGroup(tradeGroup);
            setTradeGroups(prevGroups => 
                prevGroups.map(group => group._id === updatedTradeGroup._id ? updatedTradeGroup : group)
            );
            return updatedTradeGroup;
        } catch (error) {
            console.error('Failed to update trade group', error);
            throw error;
        }
    };

    return {
        createTradeGroup,
        updateTradeGroup
    };
};

export default useTradeOperations;
