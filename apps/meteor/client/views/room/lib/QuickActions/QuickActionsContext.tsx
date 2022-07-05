import { EventHandlerOf } from '@rocket.chat/emitter';
import { createContext, useContext } from 'react';

import { actions, listen, QuickActionsActionConfig, QuickActionsAction, Events } from '.';

import './defaultActions';

export type QuickActionsEventHandler = (handler: EventHandlerOf<Events, 'change'>) => Function;

export type QuickActionsContextValue = {
	actions: Map<QuickActionsActionConfig['id'], QuickActionsAction>;
	listen: QuickActionsEventHandler;
};

export const QuickActionsContext = createContext<QuickActionsContextValue>({
	actions,
	listen,
});

export const useQuickActionsContext = (): QuickActionsContextValue => useContext(QuickActionsContext);
