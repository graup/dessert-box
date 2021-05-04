import React from 'react';
import type * as Polymorphic from '@radix-ui/react-polymorphic';

interface AtomsFnBase {
  (...args: any): string;
  properties: Set<string>;
}

export function createBox<AtomsFn extends AtomsFnBase>(atomsFn: AtomsFn) {
  type BoxProps = {
    as?: keyof JSX.IntrinsicElements;
    children: any;
    className?: string;
  } & Parameters<AtomsFn>[0];

  function Box({
    as: Element = 'div',
    className,
    children,
    ...props
  }: BoxProps) {
    let hasAtomProps = false;
    let atomProps: Record<string, unknown> = {};
    let otherProps: Record<string, unknown> = {};

    Object.entries(props).map(([name, value]) => {
      if (atomsFn.properties.has(name)) {
        hasAtomProps = true;
        atomProps[name] = value;
      } else {
        otherProps[name] = value;
      }
    });

    return (
      <Element
        {...otherProps}
        className={
          hasAtomProps || className
            ? `${className ?? ''}${hasAtomProps && className ? ' ' : ''}${
                hasAtomProps ? atomsFn(atomProps) : ''
              }`
            : undefined
        }
      >
        {children}
      </Element>
    );
  }

  return Box as Polymorphic.ForwardRefComponent<'div', Omit<BoxProps, 'as'>>;
}

export function createBoxWithAtomsProp<AtomsFn extends AtomsFnBase>(atomsFn: AtomsFn) {
  type BoxProps = {
    as?: keyof JSX.IntrinsicElements;
    children: any;
    className?: string;
    atoms?: Parameters<AtomsFn>[0]
  };

  function Box({
    as: Element = 'div',
    className,
    children,
    atoms,
    ...props
  }: BoxProps) {
    const hasAtomProps = typeof atoms !== 'undefined';

    return (
      <Element
        {...props}
        className={
          hasAtomProps || className
            ? `${className ?? ''}${hasAtomProps && className ? ' ' : ''}${
                hasAtomProps ? atomsFn(atoms) : ''
              }`
            : undefined
        }
      >
        {children}
      </Element>
    );
  }

  return Box as Polymorphic.ForwardRefComponent<'div', Omit<BoxProps, 'as'>>;
}
