import React from 'react';

type AnyProps = Record<string, unknown>;

type EventHandler = (...args: unknown[]) => void;

const mergeProps = (slotProps: AnyProps, childProps: AnyProps): AnyProps => {
	const merged: AnyProps = { ...childProps, ...slotProps };

	if (slotProps.className || childProps.className) {
		merged.className = [childProps.className, slotProps.className]
			.filter(Boolean)
			.join(' ');
	}

	if (slotProps.style || childProps.style) {
		merged.style = {
			...(childProps.style as React.CSSProperties),
			...(slotProps.style as React.CSSProperties),
		};
	}

	for (const key of Object.keys(slotProps)) {
		if (key.startsWith('on') && typeof slotProps[key] === 'function') {
			const slotHandler = slotProps[key] as EventHandler;
			const childHandler = childProps[key] as EventHandler | undefined;

			merged[key] = childHandler
				? (...args: unknown[]) => {
						slotHandler(...args);
						childHandler(...args);
					}
				: slotHandler;
		}
	}

	return merged;
};

export type SlotProps = {
	children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export const Slot = React.forwardRef<Element, SlotProps>(
	({ children, ...props }, ref) => {
		const child = React.Children.toArray(children).find(React.isValidElement);

		if (!child) {
			return null;
		}

		const resolvedChild = child as React.ReactElement<AnyProps>;
		const mergedProps = mergeProps(props as AnyProps, resolvedChild.props);

		return React.cloneElement(resolvedChild, { ...mergedProps, ref });
	},
);

Slot.displayName = 'Slot';
