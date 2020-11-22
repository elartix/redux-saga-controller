
// outsource dependencies
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// local dependencies
import { Controller } from './controller';
import { unsubscribeAction, subscribeAction } from './saga';
import { removeCSDAction, createCSDAction, selectCSD } from './reducer';

// private HOOK
const useReducerSubscribe = <T extends string, I>(controller: Controller<T, I>) : null => {
  const name = controller.name;
  const initial = controller.initial;
  const dispatch = useDispatch();
  const remove = useCallback(() => {
    dispatch(removeCSDAction(name));
  }, [name, dispatch]);
  const create = useCallback(() => dispatch(createCSDAction(name, initial)), [initial, name, dispatch]);
  useEffect(() => create() && remove, [create, remove]);
  return null;
};

// HOOK
export const useSubscribe = <T extends string, I>(controller: Controller<T, I>) : boolean => {
  useReducerSubscribe(controller);
  const dispatch = useDispatch();
  const { connected } = useSelector(selectCSD<I>(controller.name));
  const subscribe = useCallback(() => dispatch(subscribeAction(controller)), [controller, dispatch]);
  const unsubscribe = useCallback(() => {
    dispatch(unsubscribeAction(controller));
  }, [controller, dispatch]);
  useEffect(() => subscribe() && unsubscribe, [subscribe, unsubscribe]);
  return connected;
};
