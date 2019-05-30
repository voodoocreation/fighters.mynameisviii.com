import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";

import { ICharacter, IMoveset } from "../../../models/root.models";

import Combo from "../Combo/Combo";

import "./Character.scss";

interface IProps extends ICharacter, InjectedIntlProps {}

class Character extends React.Component<IProps> {
  public render() {
    const { imageUrl, name, movesets, slug } = this.props;

    return (
      <article className={`Character Character--${slug}`}>
        <div
          className="Character--image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        <div className="Character--content">
          <h2 id={slug}>{name}</h2>

          {movesets.map(this.renderMoveset)}
        </div>
      </article>
    );
  }

  private renderMoveset = (moveset: IMoveset) => (
    <section className="Character--moveset" key={moveset.name}>
      <h3>{moveset.name}</h3>

      <dl>
        {moveset.moves.map(move => (
          <React.Fragment key={move.name}>
            <dl>
              <span>{move.name}</span>{" "}
              {move.conditions ? (
                <span className="Move--conditions">{move.conditions}</span>
              ) : null}
            </dl>

            <dd className="Move--combo">
              <Combo>{move.combo}</Combo>
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </section>
  );
}

const CharacterWrapped = injectIntl(Character);

export default CharacterWrapped;
